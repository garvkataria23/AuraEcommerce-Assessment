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

module.exports = router;
