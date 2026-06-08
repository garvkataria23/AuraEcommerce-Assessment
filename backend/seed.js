const mongoose = require('mongoose');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auraecommerce';

const products = [
  { name: 'Mobile', price: 15999, description: 'A powerful smartphone with smooth performance and long battery life.', image: 'https://via.placeholder.com/300x200?text=Mobile', category: 'Electronics', stock: 100, featured: true },
  { name: 'Laptop', price: 59999, description: 'A lightweight laptop suitable for office, coding, and daily productivity.', image: 'https://via.placeholder.com/300x200?text=Laptop', category: 'Computers', stock: 50, featured: true },
  { name: 'Headphones', price: 2999, description: 'Comfortable wireless headphones with clear sound quality.', image: 'https://via.placeholder.com/300x200?text=Headphones', category: 'Accessories', stock: 200, featured: true },
  { name: 'Smart Watch', price: 4999, description: 'Smart watch with fitness tracking, notifications, and modern design.', image: 'https://via.placeholder.com/300x200?text=Smart+Watch', category: 'Wearables', stock: 75, featured: true },
  { name: 'Tablet', price: 24999, description: 'Perfect for reading, streaming, and light productivity on the go.', image: 'https://via.placeholder.com/300x200?text=Tablet', category: 'Electronics', stock: 60 },
  { name: 'Wireless Mouse', price: 799, description: 'Ergonomic wireless mouse with smooth tracking and long battery life.', image: 'https://via.placeholder.com/300x200?text=Mouse', category: 'Accessories', stock: 300 },
  { name: 'Mechanical Keyboard', price: 2499, description: 'RGB mechanical keyboard with blue switches for satisfying clicks.', image: 'https://via.placeholder.com/300x200?text=Keyboard', category: 'Accessories', stock: 150 },
  { name: 'Monitor 27"', price: 18999, description: '27-inch 4K IPS monitor with vivid colors and adjustable stand.', image: 'https://via.placeholder.com/300x200?text=Monitor', category: 'Computers', stock: 40, featured: true },
  { name: 'Fitness Band', price: 1999, description: 'Track your steps, heart rate, and sleep patterns effortlessly.', image: 'https://via.placeholder.com/300x200?text=Fitness+Band', category: 'Wearables', stock: 120 },
  { name: 'Bluetooth Speaker', price: 1499, description: 'Portable Bluetooth speaker with deep bass and 12hr battery.', image: 'https://via.placeholder.com/300x200?text=Speaker', category: 'Electronics', stock: 85 },
  { name: 'USB-C Hub', price: 1299, description: '7-in-1 USB-C hub with HDMI, SD card, and USB 3.0 ports.', image: 'https://via.placeholder.com/300x200?text=USB+Hub', category: 'Accessories', stock: 180 },
  { name: 'Webcam HD', price: 3499, description: '1080p webcam with autofocus and built-in microphone.', image: 'https://via.placeholder.com/300x200?text=Webcam', category: 'Computers', stock: 90 },
  { name: 'Gaming Chair', price: 15999, description: 'Ergonomic gaming chair with lumbar support and adjustable armrests.', image: 'https://via.placeholder.com/300x200?text=Gaming+Chair', category: 'Furniture', stock: 30, featured: true },
  { name: 'LED Desk Lamp', price: 1499, description: 'Adjustable LED desk lamp with multiple brightness levels and USB charging.', image: 'https://via.placeholder.com/300x200?text=Desk+Lamp', category: 'Furniture', stock: 110 },
  { name: 'Wireless Earbuds', price: 3999, description: 'True wireless earbuds with active noise cancellation and 30hr battery.', image: 'https://via.placeholder.com/300x200?text=Earbuds', category: 'Accessories', stock: 200, featured: true },
  { name: 'External SSD 1TB', price: 8499, description: '1TB portable SSD with USB-C, 1050MB/s read speeds.', image: 'https://via.placeholder.com/300x200?text=SSD', category: 'Computers', stock: 65 },
  { name: 'Coffee Maker', price: 5499, description: 'Automatic drip coffee maker with programmable timer and 12-cup capacity.', image: 'https://via.placeholder.com/300x200?text=Coffee+Maker', category: 'Home', stock: 45 },
  { name: 'Air Purifier', price: 12999, description: 'HEPA air purifier with smart sensors and quiet operation.', image: 'https://via.placeholder.com/300x200?text=Air+Purifier', category: 'Home', stock: 35, featured: true },
  { name: 'Yoga Mat', price: 999, description: 'Premium non-slip yoga mat with carrying strap, 6mm thick.', image: 'https://via.placeholder.com/300x200?text=Yoga+Mat', category: 'Sports', stock: 250 },
  { name: 'Dumbbell Set 20kg', price: 7999, description: 'Adjustable dumbbell set with durable weights and ergonomic grip.', image: 'https://via.placeholder.com/300x200?text=Dumbbells', category: 'Sports', stock: 55 },
  { name: 'Backpack 40L', price: 2499, description: 'Water-resistant travel backpack with USB charging port and padded laptop compartment.', image: 'https://via.placeholder.com/300x200?text=Backpack', category: 'Accessories', stock: 140 },
  { name: 'Smart Plug', price: 799, description: 'WiFi smart plug with voice control and energy monitoring via app.', image: 'https://via.placeholder.com/300x200?text=Smart+Plug', category: 'Home', stock: 190 }
];

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
