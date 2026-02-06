# 🚀 Deployment Guide

This guide will walk you through deploying your Bug Tracker application to production using free hosting services.

## 📋 Prerequisites

Before you begin, ensure you have:
- [ ] A GitHub account (for code hosting)
- [ ] A Render account (for backend deployment)
- [ ] A Netlify account (for frontend deployment)
- [ ] MongoDB Atlas cluster (already configured)
- [ ] Git installed on your machine

---

## 🗂️ Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository (if not already done)

```powershell
# Navigate to project root
cd d:\labmentix_bug_fixer

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Bug Tracker MERN App"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"New repository"**
3. Name it: `bug-tracker-mern`
4. Keep it **Public** (required for free Netlify/Render)
5. **DO NOT** initialize with README
6. Click **"Create repository"**

### 1.3 Push Code to GitHub

```powershell
# Add remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/bug-tracker-mern.git

# Push code
git branch -M main
git push -u origin main
```

---

## 🗄️ Step 2: Configure MongoDB Atlas

### 2.1 Update Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to **Network Access** (left sidebar)
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

> ⚠️ **Security Note**: For production, you should whitelist only your deployment server IPs. For now, 0.0.0.0/0 is acceptable for testing.

### 2.2 Get Connection String

1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Copy the connection string
4. Keep it ready for backend deployment

---

## 🖥️ Step 3: Deploy Backend to Render

### 3.1 Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up with **GitHub** (recommended)
3. Authorize Render to access your repositories

### 3.2 Create New Web Service

1. From Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your `bug-tracker-mern` repository
4. Configure the service:

```yaml
Name: bug-tracker-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Environment: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 3.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate a strong secret (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |

### 3.4 Deploy Backend

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Once complete, copy your backend URL:
   - Example: `https://bug-tracker-backend.onrender.com`
4. Test the API:
   ```
   https://bug-tracker-backend.onrender.com/api/health
   ```

> 📝 **Note**: Render free tier spins down after inactivity. First request may take 30-60 seconds.

---

## 🌐 Step 4: Deploy Frontend to Netlify

### 4.1 Update Frontend Environment Variables

Before deploying, update the frontend to use your deployed backend URL.

1. Open `frontend/.env.production`
2. Update `VITE_API_URL`:
   ```env
   VITE_API_URL=https://bug-tracker-backend.onrender.com/api
   ```
3. Commit and push changes:
   ```powershell
   git add .
   git commit -m "Update production API URL"
   git push
   ```

### 4.2 Create Netlify Account

1. Go to [Netlify.com](https://netlify.com)
2. Sign up with **GitHub**
3. Authorize Netlify to access your repositories

### 4.3 Import Project

1. From Netlify Dashboard, click **"Add new site"** → **"Import an existing project"**
2. Select **"Deploy with GitHub"**
3. Choose `bug-tracker-mern` repository
4. Configure build settings:

```yaml
Base directory: frontend
Build command: npm run build
Publish directory: dist
```

### 4.4 Add Environment Variables

Under **"Site settings"** → **"Environment variables"**, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your Render backend URL + `/api` |

Example: `https://bug-tracker-backend.onrender.com/api`

### 4.5 Deploy Frontend

1. Click **"Deploy site"**
2. Wait 2-3 minutes for build and deployment
3. Once complete, you'll get a live URL:
   - Example: `https://bug-tracker-mern.netlify.app`

---

## ✅ Step 5: Test Your Deployment

### 5.1 Backend Testing

Test these endpoints in your browser or Postman:

```
1. Health Check:
   https://YOUR-BACKEND.onrender.com/api/health
   Expected: {"status": "healthy", ...}

2. Root Endpoint:
   https://YOUR-BACKEND.onrender.com/
   Expected: {"message": "Bug Tracker API is running!"}
```

### 5.2 Frontend Testing

Visit your Netlify URL and test:

1. **Registration**: Create a new account
2. **Login**: Log in with credentials
3. **Projects**: Create a new project
4. **Tickets**: Create, view, edit tickets
5. **Filters**: Test search and filter functionality
6. **Kanban**: Drag and drop tickets
7. **Comments**: Add comments to tickets

### 5.3 Check Browser Console

Open Developer Tools (F12) and verify:
- ✅ No CORS errors
- ✅ API requests going to correct backend URL
- ✅ Successful authentication
- ✅ Data loading properly

---

## 🔧 Troubleshooting

### Issue: CORS Errors

**Solution**: Ensure your backend CORS is configured correctly in `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://YOUR-FRONTEND.netlify.app'
  ],
  credentials: true
}));
```

### Issue: "Cannot connect to database"

**Solution**: 
1. Check MongoDB Atlas Network Access allows 0.0.0.0/0
2. Verify `MONGODB_URI` in Render environment variables
3. Check Render logs for detailed error

### Issue: "API endpoint not found"

**Solution**:
1. Verify `VITE_API_URL` in Netlify environment variables
2. Ensure it includes `/api` at the end
3. Check frontend is using `import.meta.env.VITE_API_URL`

### Issue: Frontend shows blank page

**Solution**:
1. Check Netlify build logs for errors
2. Verify Base directory is set to `frontend`
3. Check browser console for errors
4. Ensure all dependencies are in `package.json`

### Issue: Render service is slow

**Solution**: 
- Render free tier spins down after 15 minutes of inactivity
- First request after inactivity takes 30-60 seconds to wake up
- Consider keeping service active or upgrading to paid tier

---

## 🔄 Updating Your Deployment

### Update Backend

```powershell
# Make changes to backend code
cd backend
# ... make your changes ...

# Commit and push
git add .
git commit -m "Update backend"
git push

# Render will auto-deploy in ~2 minutes
```

### Update Frontend

```powershell
# Make changes to frontend code
cd frontend
# ... make your changes ...

# Commit and push
git add .
git commit -m "Update frontend"
git push

# Netlify will auto-deploy in ~1 minute
```

---

## 📊 Monitoring Your Application

### Render Dashboard

- View logs in real-time
- Monitor CPU and memory usage
- Check deployment history
- View environment variables

### Netlify Dashboard

- View deployment status
- Check build logs
- Monitor analytics
- View site performance

### MongoDB Atlas

- Monitor database connections
- View performance metrics
- Check query performance
- Monitor storage usage

---

## 🎯 Production Checklist

Before going live with real users:

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Netlify
- [ ] MongoDB Atlas configured with proper network access
- [ ] All environment variables set correctly
- [ ] Health check endpoint working
- [ ] Registration and login functional
- [ ] CRUD operations working
- [ ] Kanban board functional
- [ ] Comments system working
- [ ] Filters and search working
- [ ] Mobile responsive design
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Toast notifications working
- [ ] No console errors in browser
- [ ] API response times acceptable

---

## 🔐 Security Considerations

### Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Rotate secrets regularly
- ✅ Use different secrets for dev and production

### MongoDB

- ✅ Use strong database passwords
- ✅ Limit network access to specific IPs when possible
- ✅ Enable MongoDB Atlas audit logs
- ✅ Regular backups

### API Security

- ✅ Rate limiting on auth endpoints
- ✅ Input validation on all endpoints
- ✅ Helmet.js for security headers
- ✅ HTTPS only (Render/Netlify handle this)

---

## 💡 Tips for Free Tier Users

### Render Free Tier Limits

- ⏰ Services spin down after 15 minutes of inactivity
- ⚡ 750 hours/month of runtime
- 💾 512 MB RAM
- 🔄 Automatic SSL certificates

### Netlify Free Tier Limits

- 🚀 100 GB bandwidth/month
- ⚡ 300 build minutes/month
- 🔄 Automatic SSL certificates
- 📊 Web analytics included

### Cost Optimization

1. **Backend**: Consider Render's hobby tier ($7/mo) to keep service always on
2. **Frontend**: Netlify free tier is usually sufficient
3. **Database**: MongoDB Atlas M0 (free tier) is fine for small apps
4. **CDN**: Netlify handles this automatically

---

## 📞 Support Resources

### Official Documentation

- [Render Docs](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

### Community

- [Render Community](https://community.render.com)
- [Netlify Forums](https://answers.netlify.com)
- [MongoDB Forums](https://www.mongodb.com/community/forums)

---

## 🎉 Congratulations!

Your Bug Tracker application is now live! Share your deployment URLs:

- **Frontend**: `https://YOUR-APP.netlify.app`
- **Backend**: `https://YOUR-BACKEND.onrender.com`

Add these URLs to your GitHub README for easy access.

---

**Last Updated**: February 6, 2026 - Netlify Deployment
