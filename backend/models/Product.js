const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, index: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true, index: true }
}, { toJSON: { virtuals: true } });

productSchema.index({ name: 'text', category: 1 });

module.exports = mongoose.model('Product', productSchema);
