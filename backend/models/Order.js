const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  quantity: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true, index: true },
  address: { type: String, required: true },
  mobile: { type: String, required: true },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
