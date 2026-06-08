const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auraecommerce';

const products = [
  {
    name: 'Mobile',
    price: 15999,
    description: 'A powerful smartphone with smooth performance and long battery life.',
    image: 'https://via.placeholder.com/300x200?text=Mobile',
    category: 'Electronics'
  },
  {
    name: 'Laptop',
    price: 59999,
    description: 'A lightweight laptop suitable for office, coding, and daily productivity.',
    image: 'https://via.placeholder.com/300x200?text=Laptop',
    category: 'Computers'
  },
  {
    name: 'Headphones',
    price: 2999,
    description: 'Comfortable wireless headphones with clear sound quality.',
    image: 'https://via.placeholder.com/300x200?text=Headphones',
    category: 'Accessories'
  },
  {
    name: 'Smart Watch',
    price: 4999,
    description: 'Smart watch with fitness tracking, notifications, and modern design.',
    image: 'https://via.placeholder.com/300x200?text=Smart+Watch',
    category: 'Wearables'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const created = await Product.insertMany(products);
    console.log(`Seeded ${created.length} products`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
