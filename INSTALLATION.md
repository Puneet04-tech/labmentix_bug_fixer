# 🚀 Installation & Setup Instructions

## Prerequisites
- Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- MongoDB Atlas account (free) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- Git (optional) - [Download here](https://git-scm.com/)

---

## Step 1: Install Backend Dependencies

Open PowerShell/Terminal and navigate to the backend folder:

```powershell
cd d:\labmentix_bug_fixer\backend
npm install
```

This will install:
- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- cors
- helmet
- express-validator
- nodemon (dev dependency)

---

## Step 2: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or login
3. Create a new cluster (free tier is fine)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)

---

## Step 3: Configure Backend Environment

1. In the `backend` folder, create a `.env` file:

```powershell
cd d:\labmentix_bug_fixer\backend
Copy-Item .env.example .env
```

2. Open `.env` file and update with your details:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/bugtracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_random_string_here
NODE_ENV=development
```

**Important**: 
- Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your MongoDB Atlas credentials
- Generate a random JWT_SECRET (can be any long random string)

---

## Step 4: Start Backend Server

```powershell
cd d:\labmentix_bug_fixer\backend
npm run dev
```

You should see:
```
🚀 Server is running on port 5000
✅ MongoDB Connected: cluster.mongodb.net
```

---

## Step 5: Install Frontend Dependencies

Open a **NEW** PowerShell window:

```powershell
cd d:\labmentix_bug_fixer\frontend
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- react-beautiful-dnd
- react-toastify
- vite
- tailwindcss
- postcss
- autoprefixer

---

## Step 6: Start Frontend Development Server

```powershell
cd d:\labmentix_bug_fixer\frontend
npm run dev
```

You should see:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## Step 7: Open in Browser

Open your browser and go to:
```
http://localhost:3000
```

You should see the Bug Tracker welcome screen! 🎉

---

## Quick Start Commands (After Initial Setup)

### Start Backend:
```powershell
cd d:\labmentix_bug_fixer\backend
npm run dev
```

### Start Frontend (in another terminal):
```powershell
cd d:\labmentix_bug_fixer\frontend
npm run dev
```

---

## Troubleshooting

### Issue: MongoDB connection error
- Check your MongoDB URI is correct
- Ensure your IP is whitelisted in MongoDB Atlas (Network Access)
- Verify username/password are correct

### Issue: Port already in use
- Change the PORT in `.env` file (e.g., 5001)
- Or stop the process using the port:
  ```powershell
  # Find process on port 5000
  netstat -ano | findstr :5000
  # Kill the process (replace PID)
  taskkill /PID <PID> /F
  ```

### Issue: Node modules not found
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

### Issue: Tailwind styles not loading
- Restart the frontend dev server
- Clear browser cache
- Check if `index.css` imports are correct

---

## VS Code Extensions (Recommended)

Install these for better development experience:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- MongoDB for VS Code

---

## Next Steps

✅ Day 1 Complete!

Ready for Day 2? Run this when you want to continue:
```
I'm ready for Day 2 - Let's implement authentication!
```

---

## Project Structure Overview

```
labmentix_bug_fixer/
│
├── backend/                    # Node.js + Express API
│   ├── config/                 # Database configuration
│   ├── middleware/             # Auth & validation middleware
│   ├── models/                 # Mongoose models (Day 2+)
│   ├── routes/                 # API routes (Day 2+)
│   ├── controllers/            # Business logic (Day 2+)
│   ├── .env                    # Environment variables (create this)
│   ├── .env.example            # Template for .env
│   ├── package.json            # Dependencies
│   └── server.js               # Entry point
│
├── frontend/                   # React + Vite
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable components (Day 2+)
│   │   ├── pages/              # Page components (Day 2+)
│   │   ├── context/            # React Context (Day 2+)
│   │   ├── utils/              # Helpers & API config
│   │   ├── App.jsx             # Main component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML template
│   ├── package.json            # Dependencies
│   ├── vite.config.js          # Vite configuration
│   └── tailwind.config.js      # Tailwind configuration
│
├── README.md                   # Project documentation
├── DAY_WISE_GUIDE.md          # Detailed day-wise plan
└── INSTALLATION.md             # This file
```

---

## Resources

- [React Docs](https://react.dev/)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev/)

---

**Happy Coding! 🚀**
