# Bug Tracker Setup Script
# This script installs all dependencies for both backend and frontend

Write-Host "🐛 Bug Tracker - Automated Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install Backend Dependencies
Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Yellow
Write-Host "Location: backend/" -ForegroundColor Gray
Set-Location -Path "backend"

if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend installation failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ package.json not found in backend folder!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created!" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANT: Edit .env file and add your MongoDB URI and JWT Secret!" -ForegroundColor Red
    Write-Host ""
}

Set-Location ..

# Install Frontend Dependencies
Write-Host "📦 Installing Frontend Dependencies..." -ForegroundColor Yellow
Write-Host "Location: frontend/" -ForegroundColor Gray
Set-Location -Path "frontend"

if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend installation failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ package.json not found in frontend folder!" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Edit backend/.env file with your MongoDB URI" -ForegroundColor White
Write-Host "2. Start backend:  cd backend && npm run dev" -ForegroundColor White
Write-Host "3. Start frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "4. Open browser:   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📖 Read INSTALLATION.md for detailed setup instructions" -ForegroundColor Cyan
Write-Host "📅 Check DAY_WISE_GUIDE.md for development plan" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy Coding! 🚀" -ForegroundColor Green
