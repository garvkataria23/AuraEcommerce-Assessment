const mongoose = require('mongoose');
const User = require('./models/User');

const email = process.argv[2];
if (!email) {
  console.log('Usage: node make-admin.js <email>');
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auraecommerce');
  const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
  if (user) {
    console.log('Admin role granted to:', user.email);
  } else {
    console.log('User not found with email:', email);
  }
  await mongoose.disconnect();
})();
