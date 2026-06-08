const mongoose = require('mongoose');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

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

const products = [
  { name: 'Mobile', price: 15999, description: 'A powerful smartphone with smooth performance and long battery life.', category: 'Electronics', stock: 100, featured: true },
  { name: 'Laptop', price: 59999, description: 'A lightweight laptop suitable for office, coding, and daily productivity.', category: 'Computers', stock: 50, featured: true },
  { name: 'Headphones', price: 2999, description: 'Comfortable wireless headphones with clear sound quality.', category: 'Accessories', stock: 200, featured: true },
  { name: 'Smart Watch', price: 4999, description: 'Smart watch with fitness tracking, notifications, and modern design.', category: 'Wearables', stock: 75, featured: true },
  { name: 'Tablet', price: 24999, description: 'Perfect for reading, streaming, and light productivity on the go.', category: 'Electronics', stock: 60 },
  { name: 'Wireless Mouse', price: 799, description: 'Ergonomic wireless mouse with smooth tracking and long battery life.', category: 'Accessories', stock: 300 },
  { name: 'Mechanical Keyboard', price: 2499, description: 'RGB mechanical keyboard with blue switches for satisfying clicks.', category: 'Accessories', stock: 150 },
  { name: 'Monitor 27"', price: 18999, description: '27-inch 4K IPS monitor with vivid colors and adjustable stand.', category: 'Computers', stock: 40, featured: true },
  { name: 'Fitness Band', price: 1999, description: 'Track your steps, heart rate, and sleep patterns effortlessly.', category: 'Wearables', stock: 120 },
  { name: 'Bluetooth Speaker', price: 1499, description: 'Portable Bluetooth speaker with deep bass and 12hr battery.', category: 'Electronics', stock: 85 },
  { name: 'USB-C Hub', price: 1299, description: '7-in-1 USB-C hub with HDMI, SD card, and USB 3.0 ports.', category: 'Accessories', stock: 180 },
  { name: 'Webcam HD', price: 3499, description: '1080p webcam with autofocus and built-in microphone.', category: 'Computers', stock: 90 },
  { name: 'Gaming Chair', price: 15999, description: 'Ergonomic gaming chair with lumbar support and adjustable armrests.', category: 'Furniture', stock: 30, featured: true },
  { name: 'LED Desk Lamp', price: 1499, description: 'Adjustable LED desk lamp with multiple brightness levels and USB charging.', category: 'Furniture', stock: 110 },
  { name: 'Wireless Earbuds', price: 3999, description: 'True wireless earbuds with active noise cancellation and 30hr battery.', category: 'Accessories', stock: 200, featured: true },
  { name: 'External SSD 1TB', price: 8499, description: '1TB portable SSD with USB-C, 1050MB/s read speeds.', category: 'Computers', stock: 65 },
  { name: 'Coffee Maker', price: 5499, description: 'Automatic drip coffee maker with programmable timer and 12-cup capacity.', category: 'Home', stock: 45 },
  { name: 'Air Purifier', price: 12999, description: 'HEPA air purifier with smart sensors and quiet operation.', category: 'Home', stock: 35, featured: true },
  { name: 'Yoga Mat', price: 999, description: 'Premium non-slip yoga mat with carrying strap, 6mm thick.', category: 'Sports', stock: 250 },
  { name: 'Dumbbell Set 20kg', price: 7999, description: 'Adjustable dumbbell set with durable weights and ergonomic grip.', category: 'Sports', stock: 55 },
  { name: 'Backpack 40L', price: 2499, description: 'Water-resistant travel backpack with USB charging port and padded laptop compartment.', category: 'Accessories', stock: 140 },
  { name: 'Smart Plug', price: 799, description: 'WiFi smart plug with voice control and energy monitoring via app.', category: 'Home', stock: 190 }
].map(p => ({ ...p, image: productImages[p.name] }));

const coupons = [
  { code: 'WELCOME10', discountPercent: 10, minOrderValue: 1000, maxDiscount: 500, expiresAt: new Date('2027-12-31'), usageLimit: 1000 },
  { code: 'SAVE20', discountPercent: 20, minOrderValue: 5000, maxDiscount: 2000, expiresAt: new Date('2027-12-31'), usageLimit: 500 },
  { code: 'FREESHIP', discountPercent: 5, minOrderValue: 50000, maxDiscount: 500, expiresAt: new Date('2027-12-31'), usageLimit: 500 }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    const created = await Product.insertMany(products);
    console.log(`Seeded ${created.length} products`);

    await Coupon.deleteMany({});
    const couponsCreated = await Coupon.insertMany(coupons);
    console.log(`Seeded ${couponsCreated.length} coupons`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
