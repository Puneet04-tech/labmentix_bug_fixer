# 🍃 MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas (cloud database) for your Bug Tracker application.

---

## Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with:
   - Email and password, OR
   - Google account, OR
   - GitHub account
3. Verify your email if required

---

## Step 2: Create a New Cluster

1. After logging in, you'll see "Deploy a cloud database"
2. Click **"Build a Database"**
3. Choose **"Shared"** (FREE tier) - Perfect for development!
4. Select:
   - **Cloud Provider**: AWS (recommended) or Google Cloud
   - **Region**: Choose closest to your location
   - **Cluster Name**: Leave as "Cluster0" or change to "BugTrackerCluster"
5. Click **"Create"**

⏱️ Wait 2-5 minutes for cluster creation

---

## Step 3: Create Database User

1. You'll see a security quickstart screen
2. Under **"How would you like to authenticate your connection?"**
3. Choose **"Username and Password"**
4. Create credentials:
   ```
   Username: bugtracker_admin
   Password: [Generate or create a strong password]
   ```
   
   ⚠️ **IMPORTANT**: Save these credentials securely!

5. Click **"Create User"**

---

## Step 4: Set Network Access

1. Under **"Where would you like to connect from?"**
2. For development, select **"My Local Environment"**
3. Click **"Add My Current IP Address"**
   
   OR for easier testing (less secure):
   
4. Click **"Add a Different IP Address"**
5. Enter: `0.0.0.0/0` (allows access from anywhere)
6. Description: "Allow All (Development Only)"
7. Click **"Add Entry"**

⚠️ **Production Note**: Never use `0.0.0.0/0` in production!

---

## Step 5: Get Connection String

1. Click **"Finish and Close"**
2. On the main dashboard, click **"Connect"** button
3. Choose **"Connect your application"**
4. Select:
   - **Driver**: Node.js
   - **Version**: 5.5 or later
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://bugtracker_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 6: Configure Your Application

1. Open `backend/.env` file
2. Replace the MONGODB_URI with your connection string
3. **IMPORTANT**: Replace `<password>` with your actual password
4. Add database name after `.net/`:

   ```env
   MONGODB_URI=mongodb+srv://bugtracker_admin:YourActualPassword@cluster0.xxxxx.mongodb.net/bugtracker?retryWrites=true&w=majority
   ```

### Example:
```env
# If your username is: bugtracker_admin
# If your password is: MySecret123
# Then your URI should be:

MONGODB_URI=mongodb+srv://bugtracker_admin:MySecret123@cluster0.abcde.mongodb.net/bugtracker?retryWrites=true&w=majority
```

---

## Step 7: Test Connection

1. Start your backend server:
   ```powershell
   cd backend
   npm run dev
   ```

2. You should see:
   ```
   🚀 Server is running on port 5000
   ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
   ```

✅ **Success!** Your app is now connected to MongoDB Atlas!

---

## 🔍 View Your Data

### Using MongoDB Atlas Interface:

1. Go to your cluster dashboard
2. Click **"Browse Collections"**
3. You'll see your databases and collections here
4. After Day 2, you'll see:
   - `bugtracker` database
   - `users` collection
   - `projects` collection (Day 3)
   - `tickets` collection (Day 4)

### Using MongoDB Compass (Desktop App):

1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Install and open it
3. Paste your connection string
4. Click "Connect"
5. Visual interface to browse your data!

---

## 🛠️ Troubleshooting

### Error: "Authentication failed"
**Problem**: Wrong username or password

**Solution**:
1. Go to "Database Access" in MongoDB Atlas
2. Click "Edit" on your user
3. Reset password
4. Update `.env` file

---

### Error: "IP not whitelisted"
**Problem**: Your IP address is not allowed

**Solution**:
1. Go to "Network Access" in MongoDB Atlas
2. Click "Add IP Address"
3. Add your current IP or use `0.0.0.0/0` for testing

---

### Error: "Could not connect to any servers"
**Problem**: Connection string incorrect or network issue

**Solution**:
1. Check your internet connection
2. Verify connection string in `.env`
3. Ensure no extra spaces in the URI
4. Check if password has special characters (encode them)

---

### Special Characters in Password

If your password has special characters like `@`, `#`, `$`, etc., you need to encode them:

| Character | Encoded |
|-----------|---------|
| @         | %40     |
| #         | %23     |
| $         | %24     |
| &         | %26     |
| +         | %2B     |
| /         | %2F     |

**Example**:
- Password: `MyPass@123`
- Encoded: `MyPass%40123`

---

## 📊 Database Structure (After Development)

```
bugtracker (database)
│
├── users
│   ├── _id
│   ├── name
│   ├── email
│   ├── password (hashed)
│   └── createdAt
│
├── projects
│   ├── _id
│   ├── title
│   ├── description
│   ├── owner (user_id)
│   ├── teamMembers []
│   └── createdAt
│
├── tickets
│   ├── _id
│   ├── title
│   ├── description
│   ├── status
│   ├── priority
│   ├── projectId
│   ├── assignee (user_id)
│   ├── reporter (user_id)
│   └── createdAt
│
└── comments
    ├── _id
    ├── ticketId
    ├── userId
    ├── text
    └── createdAt
```

---

## 💡 Best Practices

### For Development:
- ✅ Use a free M0 cluster (sufficient for learning)
- ✅ Allow all IPs for easier testing
- ✅ Keep credentials in `.env` file
- ✅ Add `.env` to `.gitignore`

### For Production:
- ✅ Upgrade to M2 or higher cluster
- ✅ Whitelist only your server IP
- ✅ Use environment variables in hosting platform
- ✅ Enable two-factor authentication
- ✅ Regular backups
- ✅ Monitor usage

---

## 🔐 Security Checklist

- [ ] Never commit `.env` file to Git
- [ ] Use strong passwords (12+ characters)
- [ ] Don't share connection strings publicly
- [ ] Restrict IP access in production
- [ ] Enable MongoDB Atlas alerts
- [ ] Regularly rotate passwords

---

## 📚 Additional Resources

- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

---

## ✅ Verification Checklist

Before proceeding to Day 2, ensure:

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP address whitelisted
- [ ] Connection string copied
- [ ] `.env` file updated with correct URI
- [ ] Backend server connects successfully
- [ ] You see "✅ MongoDB Connected" in console

---

## 🎯 What's Next?

Once your MongoDB is connected:
1. ✅ Day 1 is fully complete!
2. 🔜 Ready for Day 2: User Authentication
3. We'll create User model and save data to MongoDB

---

**Need Help?**
- MongoDB Atlas Support: https://www.mongodb.com/support
- MongoDB Community: https://www.mongodb.com/community/forums/

---

**Happy Database Setup! 🍃**
