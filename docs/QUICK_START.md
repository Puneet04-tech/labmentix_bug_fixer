# 🚀 Quick Start Guide

Get LabMentix Bug Fixer running in under 5 minutes!

---

## ⚡ Prerequisites Check

Make sure you have:
- **Node.js 16+** - Run `node --version`
- **MongoDB 4.4+** - Run `mongod --version`
- **Git** - Run `git --version`

Don't have these? Install them first:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/downloads)

---

## 🏃‍♂️ 5-Minute Setup

### 1️⃣ Clone & Install
```bash
# Clone the repository
git clone https://github.com/Puneet04-tech/labmentix_bug_fixer.git
cd labmentix_bug_fixer

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2️⃣ Environment Setup
```bash
# Go to backend directory
cd ../backend

# Copy environment file
cp .env.example .env

# Edit .env with your settings
# Use default values for quick start:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/labmentix
# JWT_SECRET=your-super-secret-jwt-key
# ADMIN_REGISTRATION_KEY=admin-secret-key-123
```

### 3️⃣ Start MongoDB
```bash
# In a new terminal, start MongoDB
mongod
```

### 4️⃣ Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Backend running on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend running on `http://localhost:3000`

---

## 🎯 First Time Setup

### Create Admin Account
1. Open `http://localhost:3000/register`
2. Fill in your details
3. Use registration key: `admin-secret-key-123`
4. Select role: "Admin"
5. Click "Register"

### Login
1. Go to `http://localhost:3000/login`
2. Enter your credentials
3. Click "Login"

### Create Your First Project
1. From dashboard, click "New Project"
2. Enter project name and description
3. Set status and priority
4. Click "Create Project"

### Add Team Members
1. Go to your project page
2. Click "Team Members" section
3. Add team members by email:
   - **Registered users**: Search existing users
   - **Outsiders**: Enter email of non-registered users

### Create Your First Ticket
1. Click "Create Ticket" or go to `/tickets/new`
2. Fill in ticket details:
   - Title: Brief description
   - Description: Detailed explanation
   - Project: Select your project
   - Type: Bug, Feature, or Improvement
   - Priority: Low, Medium, High, Critical
3. **Add screenshots** (optional):
   - Drag & drop files into upload area
   - Or click "browse" to select files
4. Click "Create Ticket"

---

## 🎉 You're All Set!

### What You Can Do Now:
- ✅ **Create Projects** - Organize your work
- ✅ **Add Team Members** - Collaborate with others
- ✅ **Create Tickets** - Track bugs and features
- ✅ **Upload Screenshots** - Add visual context
- ✅ **View Analytics** - Track progress
- ✅ **Manage Users** - Admin controls

### Quick Navigation:
- **Dashboard**: `http://localhost:3000/`
- **Projects**: `http://localhost:3000/projects`
- **Tickets**: `http://localhost:3000/tickets`
- **Create Ticket**: `http://localhost:3000/tickets/new`

---

## 🔧 Common Quick Fixes

### Port Already in Use?
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /F /PID <process-id>

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /F /PID <process-id>
```

### MongoDB Connection Issues?
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
mongod

# Test connection
mongo mongodb://localhost:27017/labmentix
```

### Frontend Build Errors?
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Backend Dependencies Issues?
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📱 Testing Your Setup

### 1. Test Backend
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"healthy","timestamp":"...","environment":"development"}`

### 2. Test Frontend
Open `http://localhost:3000` in your browser - should see the login page

### 3. Test Registration
1. Go to `http://localhost:3000/register`
2. Create a test account
3. Try logging in

### 4. Test File Upload
1. Create a ticket
2. Try uploading a small image file
3. Check if it shows "✓ Uploaded"

---

## 🎯 Next Steps

### Explore Features:
- **📊 Analytics Dashboard** - View project statistics
- **👥 Team Management** - Add/remove team members
- **📸 Screenshots** - Upload multiple files
- **🎫 Ticket Management** - Full ticket lifecycle
- **🔐 Role Management** - Admin, Core, Member roles

### Learn More:
- 📖 **Full Documentation**: [README.md](../README.md)
- 🔌 **API Reference**: [API.md](./API.md)
- 📋 **Changelog**: [CHANGELOG.md](../CHANGELOG.md)

### Need Help?
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/Puneet04-tech/labmentix_bug_fixer/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Puneet04-tech/labmentix_bug_fixer/discussions)
- 📧 **Email Support**: Contact maintainer

---

## 🎊 Success! 

You now have a fully functional bug tracking system running locally! 

**Key Features Working:**
- ✅ User authentication with roles
- ✅ Project and team management
- ✅ Ticket creation with screenshots
- ✅ Analytics dashboard
- ✅ Real-time collaboration

**Happy bug tracking! 🐛✨**

---

**⏱️ Total Time: ~5 minutes**
**🎯 Difficulty: Beginner**
**🔧 Requirements: Node.js, MongoDB, Git**
