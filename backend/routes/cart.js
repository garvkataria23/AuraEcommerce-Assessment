const express = require('express');
const router = express.Router();

const carts = {};

function getCart(sessionId) {
  if (!carts[sessionId]) carts[sessionId] = [];
  return carts[sessionId];
}

router.post('/', (req, res) => {
  try {
    const { sessionId, productId, name, price, image, quantity } = req.body;
    if (!sessionId || !productId) {
      return res.status(400).json({ message: 'sessionId and productId required' });
    }
    const cart = getCart(sessionId);
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity || 1;
    } else {
      cart.push({ productId, name, price, image, quantity: quantity || 1 });
    }
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });
    res.json(getCart(sessionId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:productId', (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });
    const cart = getCart(sessionId);
    const idx = cart.findIndex(item => item.productId === req.params.productId);
    if (idx === -1) return res.status(404).json({ message: 'Item not found' });
    cart.splice(idx, 1);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:productId', (req, res) => {
  try {
    const { sessionId, quantity } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });
    if (quantity == null || quantity < 1) return res.status(400).json({ message: 'quantity must be at least 1' });

    const cart = getCart(sessionId);
    const item = cart.find(i => i.productId === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity = quantity;
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
