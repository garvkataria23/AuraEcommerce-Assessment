const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { product: productId, rating, title, comment } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'product, rating, and comment are required' });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      name: req.user.name,
      rating,
      title,
      comment
    });

    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
      product.rating = Math.round(stats[0].avgRating * 10) / 10;
      product.numReviews = stats[0].count;
      await product.save();
    }

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
