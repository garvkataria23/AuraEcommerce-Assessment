const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auraecommerce';

const productImages = {
  Mobile: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
  Laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
  Headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'Smart Watch': 'https://images.unsplash.com/photo-1546868871-af0de0ae72a8?w=400&h=400&fit=crop',
  Tablet: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
  'Wireless Mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
  'Mechanical Keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
  'Monitor 27"': 'https://images.unsplash.com/photo-1527443222474-b00f7bf5ad40?w=400&h=400&fit=crop',
  'Fitness Band': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop',
  'Bluetooth Speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
  'USB-C Hub': 'https://images.unsplash.com/photo-1625093746806-8f0c3e6dfa53?w=400&h=400&fit=crop',
  'Webcam HD': 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop',
  'Gaming Chair': 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop',
  'LED Desk Lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop',
  'Wireless Earbuds': 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop',
  'External SSD 1TB': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop',
  'Coffee Maker': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop',
  'Air Purifier': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop',
  'Yoga Mat': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
  'Dumbbell Set 20kg': 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400&h=400&fit=crop',
  'Backpack 40L': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  'Smart Plug': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
};

async function updateImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    let updated = 0;
    for (const [name, image] of Object.entries(productImages)) {
      const result = await Product.updateMany({ name }, { $set: { image } });
      if (result.modifiedCount > 0) {
        console.log(`Updated ${result.modifiedCount} product(s): ${name}`);
        updated += result.modifiedCount;
      }
    }

    console.log(`\nTotal products updated: ${updated}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateImages();
