// Usage: node scripts/resetPassword.js --email user@example.com --password NewPass123
// This script connects to the same MongoDB as the app and updates the user's password using the Mongoose model

const mongoose = require('mongoose');
const User = require('../models/User');

const argv = require('minimist')(process.argv.slice(2));
const { email, password } = argv;

if (!email || !password) {
  console.error('Usage: node scripts/resetPassword.js --email user@example.com --password NewPass123');
  process.exit(1);
}

const run = async () => {
  try {
    const MONGO = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!MONGO) {
      console.error('MONGO_URI not set in environment. Set it or run from a shell that loads your .env.');
      process.exit(1);
    }

    await mongoose.connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }

    user.password = password; // pre-save hook will hash
    await user.save();

    console.log('Password updated for', email);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
};

run();