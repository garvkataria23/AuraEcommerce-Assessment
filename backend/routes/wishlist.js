const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) wishlist = { products: [] };
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }
    wishlist = await wishlist.populate('products');
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.products = wishlist.products.filter(id => id.toString() !== req.params.productId);
    await wishlist.save();
    const populated = await wishlist.populate('products');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
