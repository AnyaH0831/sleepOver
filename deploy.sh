#!/bin/bash

# sleepOver Deployment Quick Start
# Helps you get started with deploying frontend and backend separately

echo "🚀 SleepOver Deployment Setup"
echo "================================"
echo ""

# Check if user is in root directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the root directory"
    exit 1
fi

echo "Step 1: Git Setup"
echo "=================="
echo "Making sure your changes are committed..."

if [ -z "$(git status --porcelain)" ]; then
    echo "✅ Working directory is clean"
else
    echo "⚠️  You have uncommitted changes"
    echo "Please run:"
    echo "  git add ."
    echo "  git commit -m 'your message'"
    echo "  git push origin main"
    echo ""
fi

echo ""
echo "Step 2: Environment Files"
echo "=========================="

if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env..."
    cat > backend/.env << 'EOF'
MONGO_URI=mongodb://localhost:27017/sleepover
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
EOF
    echo "✅ Created backend/.env"
else
    echo "✅ backend/.env already exists"
fi

if [ ! -f "frontend/.env.production" ]; then
    echo "Creating frontend/.env.production..."
    cat > frontend/.env.production << 'EOF'
VITE_API_BASE_URL=https://your-backend-url.vercel.app
EOF
    echo "⚠️  Update VITE_API_BASE_URL after you deploy backend"
    echo "✅ Created frontend/.env.production"
else
    echo "✅ frontend/.env.production already exists"
fi

echo ""
echo "Step 3: Vercel Deployment"
echo "=========================="
echo ""
echo "OPTION 1: Deploy Frontend to Vercel"
echo "====================================="
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'Add New Project'"
echo "3. Import your sleepOver repository"
echo "4. Configure:"
echo "   - Framework Preset: Vite"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo "5. Add Environment Variables:"
echo "   - VITE_API_BASE_URL=https://your-backend.vercel.app"
echo "   - VITE_MAGIC_HOUR_API_KEY_1=your_key"
echo "   - VITE_GROQ_API_KEY=your_key"
echo "6. Click Deploy"
echo ""

echo "OPTION 2: Deploy Backend to Vercel"
echo "===================================="
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'Add New Project' (new project for backend!)"
echo "3. Import your sleepOver repository"
echo "4. Configure:"
echo "   - Framework: Other/Node.js"
echo "   - Root Directory: backend"
echo "   - Build Command: (leave empty)"
echo "   - Start Command: npm run start"
echo "5. Add Environment Variables:"
echo "   - MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/sleepover"
echo "   - NODE_ENV=production"
echo "   - FRONTEND_URL=https://your-frontend.vercel.app"
echo "6. Click Deploy"
echo ""

echo "⚠️  Important MongoDB Setup"
echo "============================"
echo "1. Go to https://www.mongodb.com/cloud/atlas"
echo "2. Create a free cluster"
echo "3. Create a database user"
echo "4. Whitelist IP addresses (add 0.0.0.0/0 for Vercel)"
echo "5. Copy connection string to backend/.env MONGO_URI"
echo ""

echo "Step 4: Test Locally"
echo "===================="
echo "Before deploying, test your setup:"
echo ""
echo "  npm run dev"
echo ""
echo "This will start:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend: http://localhost:3001"
echo ""

echo "Step 5: After Deployment"
echo "========================"
echo "1. Update frontend/.env.production with backend URL"
echo "2. Redeploy frontend"
echo "3. Test at https://your-frontend.vercel.app"
echo ""

echo "✅ Setup complete! See DEPLOYMENT.md for detailed instructions"
echo ""
