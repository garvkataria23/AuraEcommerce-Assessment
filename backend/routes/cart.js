const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { optionalAuth } = require('../middleware/auth');

async function getCartQuery(req) {
  if (req.user) {
    return { user: req.user._id };
  }
  const sessionId = req.query.sessionId || req.body?.sessionId;
  if (!sessionId) return null;
  return { sessionId };
}

async function findOrCreateCart(query) {
  let cart = await Cart.findOne(query);
  if (!cart) {
    cart = await Cart.create({ ...query, items: [] });
  }
  return cart;
}

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { productId, name, price, image, quantity } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const query = await getCartQuery(req);
    if (!query) return res.status(400).json({ message: 'sessionId required for anonymous users' });

    let cart = await findOrCreateCart(query);
    const existing = cart.items.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity || 1;
    } else {
      cart.items.push({ productId, name, price, image, quantity: quantity || 1 });
    }
    await cart.save();
    res.status(201).json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', optionalAuth, async (req, res) => {
  try {
    const query = await getCartQuery(req);
    if (!query) return res.status(400).json({ message: 'sessionId required for anonymous users' });

    const cart = await findOrCreateCart(query);
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/merge', optionalAuth, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Login required' });

    const { sessionId } = req.body;
    // Merge anonymous cart into user cart
    const anonymousCart = await Cart.findOne({ sessionId });
    let userCart = await Cart.findOne({ user: req.user._id });

    if (!userCart) {
      if (anonymousCart) {
        anonymousCart.user = req.user._id;
        anonymousCart.sessionId = undefined;
        await anonymousCart.save();
        return res.json(anonymousCart.items);
      }
      return res.json([]);
    }

    if (anonymousCart && anonymousCart.items.length > 0) {
      for (const anonItem of anonymousCart.items) {
        const existing = userCart.items.find(i => i.productId === anonItem.productId);
        if (existing) {
          existing.quantity += anonItem.quantity;
        } else {
          userCart.items.push(anonItem);
        }
      }
      await userCart.save();
      await Cart.deleteOne({ _id: anonymousCart._id });
    }

    res.json(userCart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:productId', optionalAuth, async (req, res) => {
  try {
    const query = await getCartQuery(req);
    if (!query) return res.status(400).json({ message: 'sessionId required' });

    const cart = await findOrCreateCart(query);
    cart.items = cart.items.filter(item => item.productId !== req.params.productId);
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:productId', optionalAuth, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ message: 'quantity must be at least 1' });

    const query = await getCartQuery(req);
    if (!query) return res.status(400).json({ message: 'sessionId required' });

    const cart = await findOrCreateCart(query);
    const item = cart.items.find(i => i.productId === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity = quantity;
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
