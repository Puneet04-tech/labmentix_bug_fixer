# 📋 Quick Reference Guide

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```powershell
# Run the setup script
cd d:\labmentix_bug_fixer
.\setup.ps1
```

### Option 2: Manual Setup
```powershell
# Backend
cd d:\labmentix_bug_fixer\backend
npm install
# Edit .env file with MongoDB URI
npm run dev

# Frontend (open new terminal)
cd d:\labmentix_bug_fixer\frontend
npm install
npm run dev
```

### Start Both Servers at Once
```powershell
cd d:\labmentix_bug_fixer
.\start.ps1
```

---

## 🔑 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React application |
| Backend API | http://localhost:5000 | Express server |
| MongoDB Atlas | https://cloud.mongodb.com | Database dashboard |

---

## 📁 Key Files

### Backend
- `server.js` - Main server file
- `config/db.js` - MongoDB connection
- `middleware/auth.js` - JWT authentication
- `.env` - Environment variables (create from .env.example)

### Frontend
- `src/App.jsx` - Main React component
- `src/main.jsx` - Entry point
- `src/utils/api.js` - Axios configuration
- `tailwind.config.js` - Tailwind settings
- `vite.config.js` - Vite configuration

---

## 🛠️ Useful Commands

### Backend
```powershell
npm run dev        # Start with nodemon (auto-reload)
npm start          # Start normally
```

### Frontend
```powershell
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 📦 Installed Packages

### Backend Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - Cross-origin requests
- `helmet` - Security headers
- `dotenv` - Environment variables
- `express-validator` - Input validation

### Frontend Dependencies
- `react` & `react-dom` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `react-beautiful-dnd` - Drag and drop
- `react-toastify` - Notifications
- `tailwindcss` - CSS framework
- `vite` - Build tool

---

## 🎯 Project Structure

```
labmentix_bug_fixer/
│
├── 📄 README.md                    # Project overview
├── 📄 INSTALLATION.md              # Detailed setup guide
├── 📄 DAY_WISE_GUIDE.md           # 14-day development plan
├── 📄 QUICK_REFERENCE.md          # This file
├── 📜 setup.ps1                    # Automated setup script
├── 📜 start.ps1                    # Start both servers
│
├── 📂 backend/                     # Node.js + Express
│   ├── 📂 config/                  # Configuration files
│   │   └── db.js                   # MongoDB connection
│   ├── 📂 middleware/              # Custom middleware
│   │   └── auth.js                 # JWT authentication
│   ├── 📂 models/                  # Mongoose models (Day 2+)
│   ├── 📂 routes/                  # API routes (Day 2+)
│   ├── 📂 controllers/             # Business logic (Day 2+)
│   ├── 📄 .env.example             # Environment template
│   ├── 📄 .env                     # Your config (create this!)
│   ├── 📄 .gitignore              # Git ignore rules
│   ├── 📄 package.json            # Dependencies
│   └── 📄 server.js               # Main entry point
│
└── 📂 frontend/                    # React + Vite + Tailwind
    ├── 📂 public/                  # Static assets
    ├── 📂 src/
    │   ├── 📂 components/          # Reusable components (Day 2+)
    │   ├── 📂 pages/               # Page components (Day 2+)
    │   ├── 📂 context/             # React Context (Day 2+)
    │   ├── 📂 utils/               # Utilities
    │   │   └── api.js              # Axios instance
    │   ├── 📄 App.jsx              # Main component
    │   ├── 📄 main.jsx             # Entry point
    │   └── 📄 index.css            # Global styles + Tailwind
    ├── 📄 index.html               # HTML template
    ├── 📄 .gitignore              # Git ignore rules
    ├── 📄 package.json            # Dependencies
    ├── 📄 vite.config.js          # Vite config
    ├── 📄 tailwind.config.js      # Tailwind config
    └── 📄 postcss.config.js       # PostCSS config
```

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
```
Error: querySrv ENOTFOUND
```
**Solution**: Check your `.env` file, ensure MONGODB_URI is correct

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
```powershell
# Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Run `npm install` in the respective folder

### Tailwind Not Working
**Solution**: 
1. Restart Vite dev server
2. Clear browser cache
3. Check `index.css` has Tailwind imports

---

## 📚 API Endpoints (Coming in Day 2+)

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tickets
- `GET /api/tickets/project/:id` - Get project tickets
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `PATCH /api/tickets/:id/status` - Update status

### Comments
- `GET /api/comments/ticket/:id` - Get comments
- `POST /api/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

---

## 🎨 Color Scheme (Tailwind)

Primary colors defined in `tailwind.config.js`:
- `primary-50` to `primary-900` - Blue shades
- Use `bg-primary-500` for buttons
- Use `text-primary-600` for links

---

## 📝 Code Snippets

### API Call Example (Frontend)
```javascript
import API from '../utils/api';

const fetchProjects = async () => {
  try {
    const response = await API.get('/projects');
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
};
```

### Protected Route Example (Backend)
```javascript
const auth = require('../middleware/auth');

router.get('/protected', auth, (req, res) => {
  res.json({ user: req.user });
});
```

---

## ✅ Day 1 Checklist

- [x] Backend folder structure
- [x] Frontend folder structure
- [x] Express server setup
- [x] MongoDB connection config
- [x] JWT middleware
- [x] React with Vite
- [x] Tailwind CSS configured
- [x] React Router setup
- [x] Axios API utility
- [x] Toast notifications setup
- [x] All documentation created

---

## 🚦 Next Steps

### Ready for Day 2?
Day 2 focuses on **User Authentication**:
- User model
- Register/Login APIs
- JWT tokens
- Frontend auth forms
- Auth context

Tell me when you're ready to proceed!

---

## 📞 Resources

- MongoDB Atlas: https://cloud.mongodb.com
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com
- Express Docs: https://expressjs.com

---

**Current Status**: ✅ Day 1 Complete

**Created**: January 21, 2026
