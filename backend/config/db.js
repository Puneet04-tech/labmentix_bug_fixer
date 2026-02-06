const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');

    // Provide more helpful error messages
    if (error.message.includes('ENOTFOUND')) {
      console.error('   DNS resolution failed. Check your cluster URL in MONGODB_URI');
      console.error('   Make sure the cluster name is correct (e.g., cluster0.xxxxx.mongodb.net)');
    } else if (error.message.includes('Authentication failed')) {
      console.error('   Authentication failed. Check username and password in MONGODB_URI');
      console.error('   Format: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database');
    } else if (error.message.includes('connection timed out')) {
      console.error('   Connection timed out. Check MongoDB Atlas network access settings');
      console.error('   Allow access from 0.0.0.0/0 or add Render\'s IP to whitelist');
    } else if (error.message.includes('Invalid connection string')) {
      console.error('   Invalid connection string format. Check MONGODB_URI syntax');
      console.error('   Should be: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database');
    } else {
      console.error(`   ${error.message}`);
    }

    console.error('\n🔧 Troubleshooting steps:');
    console.error('   1. Check MONGODB_URI environment variable in Render dashboard');
    console.error('   2. Verify MongoDB Atlas cluster is running');
    console.error('   3. Ensure network access allows 0.0.0.0/0');
    console.error('   4. Check database user credentials');
    console.error('   5. Verify cluster name and database name');

    process.exit(1);
  }
};

module.exports = connectDB;
