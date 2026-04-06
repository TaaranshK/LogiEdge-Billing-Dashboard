# 📋 ASSIGNMENT COMPLETION GUIDE

## LogiEdge Billing Dashboard Project

---

## ✅ REQUIREMENT 1: GitHub Repository

### Step 1.1: Initialize Git Repository

```bash
cd c:\Projects\LogiEdge Billing Dashboard
git init
git config user.name "Your Name"
git config user.email "your.email@gmail.com"
```

### Step 1.2: Create .gitignore

```
node_modules/
.env
.env.local
.DS_Store
dist/
build/
.vscode/
*.log
.npm
```

### Step 1.3: Add Files to Git

```bash
git add .
git commit -m "Initial commit: LogiEdge Billing Dashboard - MySQL Migration Complete"
```

### Step 1.4: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `logiEdge-billing-dashboard`
3. Description: "A comprehensive billing dashboard application with React frontend and Node.js/MySQL backend"
4. Choose: Public (for visibility)
5. Click "Create repository"

### Step 1.5: Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/logiEdge-billing-dashboard.git
git push -u origin main
```

**📌 GitHub Repository URL:** `https://github.com/YOUR_USERNAME/logiEdge-billing-dashboard`

---

## ✅ REQUIREMENT 2: Database Script File

### Location

The database script is already prepared at:

```
database/DATABASE_SCRIPT_COMPLETE.sql
```

### Contents

- 4 main tables: customers, items, invoices, invoice_items
- All constraints, indexes, and relationships
- Sample data for testing
- MySQL optimizations (InnoDB, UTF-8MB4)

---

## ✅ REQUIREMENT 3: Google Drive Setup

### Step 3.1: Create Google Drive Folder

1. Go to https://drive.google.com
2. Click "New" → "Folder"
3. Name: **Your Full Name** (e.g., "John Doe")
4. Click "Create"

### Step 3.2: Upload Database Script

1. Open your newly created folder
2. Click "Upload files" or "New" → "File upload"
3. Select: `database/DATABASE_SCRIPT_COMPLETE.sql`
4. Wait for upload to complete

### Step 3.3: Share Folder (if required)

Right-click folder → "Share" → Add instructor email if needed

**📌 Google Drive:** [Insert link to your folder here after creation]

---

## ✅ REQUIREMENT 4: Host Application

### Option A: Deploy Backend to Render (Free Tier)

#### Backend Setup:

1. Create account at https://render.com
2. Create new "Web Service"
3. Connect GitHub repository
4. Configure:
   ```
   Build Command: npm install
   Start Command: npm start
   Environment Variables:
   - DB_HOST=your_mysql_host
   - DB_USER=your_username
   - DB_PASSWORD=your_password
   - DB_NAME=logiEdge_billing
   - PORT=3000
   ```
5. Deploy
6. **Backend URL:** `https://your-service-name.onrender.com`

### Option B: Deploy Frontend to Vercel (Free Tier)

#### Frontend Setup:

1. Create account at https://vercel.com
2. Import project from GitHub
3. Select `frontend/frontend` as root directory
4. Configure:
   ```
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   Environment Variables:
   - VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```
5. Deploy
6. **Frontend URL:** `https://your-project.vercel.app`

### Option C: Deploy Both to Railway.app (Easy Setup)

1. Go to https://railway.app
2. Create new project
3. Add GitHub repository
4. Railway auto-detects and deploys both
5. Configure environment variables
6. Get deployment URLs

---

## ✅ REQUIREMENT 5: Source Code Folder Structure

Your project already has the required structure:

```
LogiEdge Billing Dashboard/
├── Front-End App/
│   └── frontend/
│       ├── src/
│       ├── package.json
│       └── vite.config.js
├── Back-End Server/
│   └── backend/
│       ├── src/
│       │   ├── server.js
│       │   ├── routes/
│       │   ├── controllers/
│       │   ├── models/
│       │   ├── services/
│       │   ├── config/
│       │   └── middlewares/
│       └── package.json
└── database/
    └── DATABASE_SCRIPT_COMPLETE.sql
```

### If Restructuring Needed:

```bash
# Create folder structure
mkdir "Front-End App"
mkdir "Back-End Server"

# Move folders
move frontend "Front-End App\"
move backend "Back-End Server\"
```

---

## ✅ REQUIREMENT 6: Assignment Submission

### Prepare Submission Document with:

1. **GitHub Repository URL**
   - `https://github.com/YOUR_USERNAME/logiEdge-billing-dashboard`
2. **Database Script Location**
   - `GitHub: database/DATABASE_SCRIPT_COMPLETE.sql`
   - `Google Drive: [Your Full Name]/DATABASE_SCRIPT_COMPLETE.sql`
3. **Google Drive Folder Link**
   - `https://drive.google.com/drive/folders/YOUR_FOLDER_ID`
4. **Live Application URLs**
   - Frontend: `https://your-frontend.vercel.app`
   - Backend: `https://your-backend.onrender.com`
5. **Source Code Structure**
   - Verified: Front-End App + Back-End Server folders present
6. **Project Details**
   - Technology Stack: React + Node.js + MySQL
   - Features: Billing, Customer, Item Management
   - Deployment: Vercel (Frontend) + Render (Backend)

---

## 🚀 QUICK COMMAND REFERENCE

### Git & GitHub

```bash
git init
git add .
git commit -m "message"
git push origin main
```

### Backend Development

```bash
cd backend
npm install
npm run dev      # Development
npm start        # Production
```

### Frontend Development

```bash
cd frontend/frontend
npm install
npm run dev      # Development server
npm run build    # Production build
```

### Database

```bash
mysql -u root -p < database/DATABASE_SCRIPT_COMPLETE.sql
```

---

## 📋 FINAL CHECKLIST

- [ ] GitHub repository created and code pushed
- [ ] Database script file created and accessible
- [ ] Google Drive folder created with full name
- [ ] Database script uploaded to Google Drive
- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Vercel/Railway
- [ ] Environment variables configured correctly
- [ ] Application tested and working
- [ ] Folder structure (Front-End + Back-End) verified
- [ ] Assignment submission prepared with all URLs
- [ ] All documentation reviewed and finalized

---

## 🎯 EXPECTED DEPLOYMENT TIMELINE

| Step      | Task                   | Estimated Time |
| --------- | ---------------------- | -------------- |
| 1         | GitHub Setup           | 5 min          |
| 2         | Google Drive Setup     | 5 min          |
| 3         | Backend Deployment     | 10-15 min      |
| 4         | Frontend Deployment    | 10-15 min      |
| 5         | Testing & Verification | 10 min         |
| 6         | Final Documentation    | 5 min          |
| **Total** |                        | **45-60 min**  |

---

## ⚠️ TROUBLESHOOTING

### Backend Won't Connect to Database

- Verify MySQL is running
- Check environment variables (DB_HOST, DB_USER, DB_PASSWORD)
- Ensure database exists: `logiEdge_billing`

### Frontend Shows "API Error"

- Check backend URL in environment variables
- Verify CORS is enabled in backend
- Check network tab in browser console

### Deployment Fails

- Ensure all environment variables are set
- Check build logs on deployment platform
- Verify package.json has all required dependencies
- Confirm Node.js version compatibility (v18+)

---

## 📞 SUPPORT RESOURCES

- **Node.js Docs:** https://nodejs.org/docs/
- **Express Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/
- **Render Deploy:** https://render.com/docs
- **Vercel Deploy:** https://vercel.com/docs
- **MySQL Docs:** https://dev.mysql.com/doc/

---

**Created:** April 6, 2026
**Project:** LogiEdge Billing Dashboard
**Status:** Ready for Deployment & Submission
