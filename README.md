# 🐛 Bug Tracker - MERN Stack Issue Management System

A full-stack bug tracking and issue management application built with MongoDB, Express.js, React.js, and Node.js.

## 🎯 Project Overview

This application allows teams to:
- ✅ Create & manage projects
- 🐞 Report bugs/issues as tickets
- 👥 Assign tickets to team members
- 📋 Move tickets across Kanban board (To Do, In Progress, Done)
- 🔍 Filter, search, and sort issues
- 💬 Collaborate with comments

## 🧰 Tech Stack

### Frontend
- **React.js** - Component-based UI
- **Tailwind CSS** - Modern responsive styling
- **React Beautiful DnD** - Drag-and-drop Kanban
- **Axios** - API communication
- **React Router** - Navigation
- **Vite** - Fast build tool

### Backend
- **Node.js + Express.js** - REST API
- **MongoDB + Mongoose** - Database
- **JWT + bcrypt** - Authentication
- **Helmet + CORS** - Security

## 📁 Project Structure

```
labmentix_bug_fixer/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## � Documentation

This project includes comprehensive documentation to guide you through every step:

| Document | Description |
|----------|-------------|
| 📘 [INSTALLATION.md](INSTALLATION.md) | Detailed setup instructions |
| 📅 [DAY_WISE_GUIDE.md](DAY_WISE_GUIDE.md) | Complete 14-day development plan |
| ⚡ [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Quick commands and tips |
| 🍃 [MONGODB_SETUP.md](MONGODB_SETUP.md) | MongoDB Atlas configuration guide |
| ✅ [CHECKLIST.md](CHECKLIST.md) | Complete project checklist |
| 📊 [PROGRESS.txt](PROGRESS.txt) | Visual progress tracker |
| 🌳 [PROJECT_STRUCTURE.txt](PROJECT_STRUCTURE.txt) | Folder structure visualization |
| 🎉 [DAY1_SUMMARY.md](DAY1_SUMMARY.md) | Day 1 completion summary |

## 🚀 Getting Started

### Quick Start (Recommended)

```powershell
# 1. Navigate to project folder
cd d:\labmentix_bug_fixer

# 2. Run automated setup
.\setup.ps1

# 3. Configure MongoDB (see MONGODB_SETUP.md)

# 4. Start both servers
.\start.ps1
```

### Manual Setup

See [INSTALLATION.md](INSTALLATION.md) for detailed step-by-step instructions.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier)
- npm or yarn

### Quick Commands

```powershell
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Server will run on `http://localhost:5000`  
Frontend will run on `http://localhost:3000`

## 📅 Development Progress

### ✅ Week 1 - Core Features & Backend

- [x] **Day 1**: Project Setup ✅
  - MERN folder structure
  - Tailwind CSS configuration
  - Express server with MongoDB connection
  - Complete documentation (8 files)
  - Helper scripts (setup.ps1, start.ps1)
  
- [ ] **Day 2**: Authentication
  - User model
  - Register/Login APIs with JWT
  - Frontend auth forms
  
- [ ] **Day 3**: Project Management
  - Project schema
  - CRUD APIs for projects
  - Project list UI
  
- [ ] **Day 4**: Ticket System
  - Ticket model
  - Ticket CRUD APIs
  - Auth middleware
  
- [ ] **Day 5**: Ticket Frontend
  - Ticket form
  - Ticket list display
  
- [ ] **Day 6**: UI Enhancement
  - Dashboard layout
  - Sidebar navigation
  - Responsive design
  
- [ ] **Day 7**: Testing & Bug Fixes

### 🔜 Week 2 - Advanced Features & Deployment

- [ ] **Day 8**: Kanban Board
- [ ] **Day 9**: Comments System
- [ ] **Day 10**: Filters & Search
- [ ] **Day 11**: Edit/Delete Tickets
- [ ] **Day 12**: Deployment
- [ ] **Day 13**: Polish & Mobile Responsive
- [ ] **Day 14**: Final Testing & Demo

📊 **Overall Progress**: Day 1 of 14 Complete (7.1%)

## 🔑 Key Features

### Implemented
- ✅ Project structure setup
- ✅ MongoDB connection
- ✅ JWT authentication middleware
- ✅ React with Tailwind CSS
- ✅ Vite build configuration

### Coming Soon
- 🔜 User authentication
- 🔜 Project management
- 🔜 Ticket CRUD operations
- 🔜 Kanban board with drag-and-drop
- 🔜 Comment system
- 🔜 Advanced filtering
- 🔜 Role-based access control

## 🛠️ API Endpoints (Planned)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tickets
- `GET /api/tickets/:projectId` - Get project tickets
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

### Comments
- `GET /api/comments/:ticketId` - Get ticket comments
- `POST /api/comments` - Add comment

## 👨‍💻 Author

Built as part of a 2-week MERN stack learning project.

## 📝 License

MIT License

---

**Day 1 Status**: ✅ Complete - Project structure and initial setup done!
