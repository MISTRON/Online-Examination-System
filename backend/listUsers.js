const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function listUsers() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const users = await User.find();
  users.forEach(user => {
    console.log({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password,
    });
  });
  process.exit(0);
}

listUsers().catch(err => {
  console.error(err);
  process.exit(1);
}); 