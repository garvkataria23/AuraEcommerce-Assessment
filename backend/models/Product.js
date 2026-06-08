const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  image: { type: String, required: true },
  category: { type: String, required: true, index: true },
  stock: { type: Number, default: 50, min: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { toJSON: { virtuals: true }, timestamps: true });

productSchema.index({ name: 'text', category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
