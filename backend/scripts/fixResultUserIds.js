// backend/scripts/fixResultUserIds.js
const mongoose = require('mongoose');
const Result = require('../models/Result');
const User = require('../models/User');

const MONGO_URI = 'mongodb://localhost:27017/online-examination-system';

async function fixUserIds() {
  await mongoose.connect(MONGO_URI);
  const results = await Result.find({ user: { $type: 'string' } });
  let fixed = 0;
  for (const r of results) {
    if (typeof r.user === 'string') {
      const userObj = await User.findById(r.user);
      if (userObj) {
        r.user = userObj._id;
        await r.save();
        console.log('Fixed result', r._id.toString());
        fixed++;
      } else {
        console.log('No user found for result', r._id.toString(), 'user:', r.user);
      }
    }
  }
  console.log(`Done. Fixed ${fixed} results.`);
  await mongoose.disconnect();
}

fixUserIds().catch(err => {
  console.error('Error fixing user ids:', err);
  process.exit(1);
}); 