const mongoose = require('mongoose');
const User = require('./backend/models/User');

async function checkUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/bugtracker');
    console.log('Connected to MongoDB');
    
    const email = 'chaturvedipuneet200@gmail.com';
    console.log(`\n🔍 Checking for user: ${email}`);
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (user) {
      console.log('✅ User found:');
      console.log('  ID:', user._id);
      console.log('  Name:', user.name);
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);
      console.log('  Created:', user.createdAt);
    } else {
      console.log('❌ User NOT found in database');
      
      // Check for similar emails
      const allUsers = await User.find({});
      console.log('\n📋 All users in database:');
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.name})`);
      });
    }
    
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUser();
