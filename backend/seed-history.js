const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auraecommerce';

const customerNames = [
  'Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Sneha Reddy', 'Vikram Joshi',
  'Neha Gupta', 'Rajesh Kumar', 'Ananya Das', 'Suresh Nair', 'Kavita Mehta',
  'Deepak Verma', 'Pooja Iyer', 'Arjun Khanna', 'Ritu Agarwal', 'Manish Tiwari',
  'Swati Bhat', 'Gaurav Saxena', 'Divya Choudhury', 'Harshad Deshmukh', 'Nandini Rao'
];

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow'];

const statuses = ['delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'shipped', 'confirmed', 'cancelled'];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateItems(products) {
  const count = randomBetween(1, 4);
  const items = [];
  const used = new Set();
  for (let i = 0; i < count; i++) {
    let p;
    let attempts = 0;
    do {
      p = pick(products);
      attempts++;
    } while (used.has(p._id.toString()) && attempts < 10);
    used.add(p._id.toString());
    const qty = randomBetween(1, 3);
    items.push({ productId: p._id, name: p.name, price: p.price, quantity: qty });
  }
  return items;
}

async function seedHistory() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Order.deleteMany({});
  console.log('Cleared existing orders');

  const products = await Product.find({});
  if (products.length === 0) {
    console.log('No products found. Run seed.js first.');
    process.exit(1);
  }

  const now = new Date();
  const orders = [];

  for (let monthOffset = 29; monthOffset >= 0; monthOffset--) {
    const year = now.getFullYear();
    const month = now.getMonth() - monthOffset;
    const targetMonth = new Date(year, month, 1);
    const daysInMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();

    // 15-40 orders per month, growing over time
    const orderCount = randomBetween(15 + Math.floor((29 - monthOffset) * 0.8), 40 + Math.floor((29 - monthOffset) * 1.2));

    for (let i = 0; i < orderCount; i++) {
      const day = randomBetween(1, daysInMonth);
      const hour = randomBetween(9, 21);
      const minute = randomBetween(0, 59);
      const createdAt = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), day, hour, minute);

      const items = generateItems(products);
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = subtotal > 500 ? 0 : randomBetween(40, 100);
      const tax = Math.round(subtotal * 0.18);
      const total = subtotal + shipping + tax;

      const customerName = pick(customerNames);
      const city = pick(cities);

      orders.push({
        customerName,
        address: `${randomBetween(1, 999)}, ${['MG Road', 'Ring Road', 'Main Street', 'Lake View', 'Park Avenue'][randomBetween(0, 4)]}, ${city}`,
        mobile: '98' + String(randomBetween(10000000, 99999999)),
        email: customerName.toLowerCase().replace(' ', '.') + randomBetween(1, 99) + '@email.com',
        items,
        subtotal,
        shipping,
        tax,
        discount: 0,
        total,
        status: pick(statuses),
        createdAt
      });
    }
  }

  const result = await Order.insertMany(orders);
  console.log(`Seeded ${result.length} historical orders over 30 months`);

  await mongoose.disconnect();
  console.log('Done');
  process.exit(0);
}

seedHistory().catch(err => { console.error(err); process.exit(1); });
