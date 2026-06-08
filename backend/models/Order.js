const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  quantity: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  items: { type: [orderItemSchema], required: true },
  subtotal: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: { type: String },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' }
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
