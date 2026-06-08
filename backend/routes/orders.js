const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { customerName, address, mobile, email, items, subtotal, shipping, tax, total, couponCode } = req.body;
    if (!customerName || !address || !mobile || !items || !items.length) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date() <= coupon.expiresAt && coupon.usedCount < coupon.usageLimit) {
        discount = Math.round(total * (coupon.discountPercent / 100));
        if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create({
      user: req.user._id,
      customerName,
      address,
      mobile,
      email,
      items,
      subtotal: subtotal || total,
      shipping: shipping || 0,
      tax: tax || 0,
      discount,
      couponCode: couponCode || undefined,
      total: total - discount,
      status: 'pending'
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Order.countDocuments(filter);
    res.json({ data: orders, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/analytics/overview', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const thirtyMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 29, 1);

    const monthly = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Build full 30-month series with zero padding
    const series = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      const sortKey = d.getFullYear() * 100 + (d.getMonth() + 1);
      const match = monthly.find(m => m._id.year === d.getFullYear() && m._id.month === d.getMonth() + 1);
      series.push({
        label: key,
        sortKey,
        orders: match ? match.orders : 0,
        revenue: match ? Math.round(match.revenue) : 0,
        avgOrderValue: match ? Math.round(match.avgOrderValue) : 0
      });
    }

    // Totals
    const totals = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyMonthsAgo } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          avgOrder: { $avg: '$total' }
        }
      }
    ]);

    // Category breakdown
    const categories = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyMonthsAgo } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          count: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Growth - compare last 3 months vs previous 3 months
    const last3 = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const prev3 = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const prev6 = new Date(now.getFullYear(), now.getMonth() - 8, 1);

    const [recent, previous, older] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: last3 } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: prev3, $lt: last3 } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: prev6, $lt: prev3 } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } }
      ])
    ]);

    const r = recent[0] || { revenue: 0, orders: 0 };
    const p = previous[0] || { revenue: 0, orders: 0 };
    const o = older[0] || { revenue: 0, orders: 0 };

    const revenueGrowth = p.revenue > 0 ? Math.round(((r.revenue - p.revenue) / p.revenue) * 100) : 0;
    const ordersGrowth = p.orders > 0 ? Math.round(((r.orders - p.orders) / p.orders) * 100) : 0;
    const revenueGrowthPrev = o.revenue > 0 ? Math.round(((p.revenue - o.revenue) / o.revenue) * 100) : 0;
    const ordersGrowthPrev = o.orders > 0 ? Math.round(((p.orders - o.orders) / p.orders) * 100) : 0;

    // Status breakdown
    const byStatus = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyMonthsAgo } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      series,
      totals: {
        totalOrders: totals[0]?.totalOrders || 0,
        totalRevenue: totals[0]?.totalRevenue || 0,
        avgOrder: Math.round(totals[0]?.avgOrder || 0)
      },
      growth: {
        revenueGrowth,
        ordersGrowth,
        revenueGrowthPrev,
        ordersGrowthPrev,
        recentRevenue: Math.round(r.revenue),
        previousRevenue: Math.round(p.revenue),
        recentOrders: r.orders,
        previousOrders: p.orders
      },
      topProducts: categories,
      byStatus
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
