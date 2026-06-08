const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const {
      search, category, sort, order,
      minPrice, maxPrice,
      page = 1, limit = 12,
      featured
    } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortObj = { name: 1 };
    if (sort === 'price') sortObj = { price: order === 'desc' ? -1 : 1 };
    else if (sort === 'name') sortObj = { name: order === 'desc' ? -1 : 1 };
    else if (sort === 'createdAt') sortObj = { createdAt: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(limitNum),
      Product.countDocuments(filter)
    ]);

    res.json({
      data: products,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ ...product.toJSON(), reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
