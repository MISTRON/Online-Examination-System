const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function addAdmin() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const email = 'mist@teacher.com';
  const password = 'Mist3214';
  const name = 'Mist Admin';
  const role = 'admin';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, role });
  await user.save();
  console.log('Admin user created successfully!');
  process.exit(0);
}

addAdmin().catch(err => {
  console.error(err);
  process.exit(1);
}); 