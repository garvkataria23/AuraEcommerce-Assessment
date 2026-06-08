const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
  try {
    const { customerName, address, mobile, items, total } = req.body;
    if (!customerName || !address || !mobile || !items || !items.length) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const order = await Order.create({ customerName, address, mobile, items, total });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
