const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/validate', authMiddleware, async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ valid: false, message: 'Invalid coupon code' });

    if (new Date() > coupon.expiresAt) {
      return res.status(400).json({ valid: false, message: 'Coupon has expired' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ valid: false, message: 'Coupon usage limit reached' });
    }

    if (orderValue < coupon.minOrderValue) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required`
      });
    }

    let discount = Math.round(orderValue * (coupon.discountPercent / 100));
    if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    res.json({
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discount,
      message: `${coupon.discountPercent}% off applied!`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
