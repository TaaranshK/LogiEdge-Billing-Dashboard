# Deploy LogiEdge to Render - Complete Guide

## Prerequisites
- Render account: https://render.com (sign up free)
- GitHub repository: ✅ https://github.com/TaaranshK/LogiEdge-Billing-Dashboard
- MySQL database (local or managed)
- Supabase project: ✅ Already configured

---

## Deployment Architecture

Your project has **2 separate services** on Render:

1. **Backend API** (Express.js on Node.js)
   - Handles database & Supabase storage
   - Runs on port 10000 (Render assigns dynamically)
   - Connects to MySQL database

2. **Frontend** (React/Vite - Static Site)
   - Pre-built React app
   - Served as static files
   - Connects to backend API

---

## Step 1: Build Frontend for Production

Build your React app locally first:

```bash
cd frontend/frontend
npm run build
```

This creates `dist/` folder with optimized production files.

---

## Step 2: Create Backend Service on Render

### 2a. Deploy Backend API

1. Go to **Render Dashboard** → **New** → **Web Service**
2. **Connect Repository:**
   - Select: `TaaranshK/LogiEdge-Billing-Dashboard`
   - Branch: `main`

3. **Configure Service:**
   - Name: `logiedge-backend`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Environment Variables** (Add these):
   ```
   PORT=10000
   DB_HOST=your-mysql-host.com
   DB_PORT=3306
   DB_NAME=logiedge_billing
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   SUPABASE_URL=https://tipklyvuyztquifdbhyi.supabase.co
   SUPABASE_ANON_KEY=sb_publishable_in9eE_GGT9fMWKuS03vnAg_fKz1Ty_X
   NODE_ENV=production
   ```

5. Click **Deploy**

6. **Get Backend URL** (save this):
   - Example: `https://logiedge-backend.onrender.com`

---

## Step 3: Update Frontend for Production

### 3a. Update Production API URL

Edit `frontend/frontend/.env.production`:

```env
VITE_API_URL=https://logiedge-backend.onrender.com
VITE_SUPABASE_URL=https://tipklyvuyztquifdbhyi.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_in9eE_GGT9fMWKuS03vnAg_fKz1Ty_X
```

### 3b. Rebuild Frontend

```bash
cd frontend/frontend
npm run build
```

---

## Step 4: Deploy Frontend to Render

### 4a. Deploy Static Site

1. Go to **Render Dashboard** → **New** → **Static Site**
2. **Connect Repository:**
   - Select: `TaaranshK/LogiEdge-Billing-Dashboard`
   - Branch: `main`

3. **Configure Site:**
   - Name: `logiedge-frontend`
   - Root Directory: `frontend/frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://logiedge-backend.onrender.com
   VITE_SUPABASE_URL=https://tipklyvuyztquifdbhyi.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_in9eE_GGT9fMWKuS03vnAg_fKz1Ty_X
   ```

5. Click **Deploy**

6. **Get Frontend URL** (save this):
   - Example: `https://logiedge-frontend.onrender.com`

---

## Step 5: Fix CORS on Backend

The backend needs to allow requests from your frontend domain.

Edit `backend/src/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://logiedge-frontend.onrender.com',
  credentials: true
}));
```

Or allow multiple origins:

```javascript
app.use(cors({
  origin: ['https://logiedge-frontend.onrender.com', 'http://localhost:5173'],
  credentials: true
}));
```

Push this change:
```bash
git add backend/src/server.js
git commit -m "Update CORS for Render production"
git push
```

---

## Step 6: Configure Database (Critical)

Your backend needs to connect to MySQL. Options:

### Option A: Use a Managed MySQL Service

**Railway, PlanetScale, or AWS RDS:**
- Get connection credentials
- Add to Render backend environment variables

### Option B: Keep Local MySQL
- Must be accessible over internet (not recommended)
- Better: Set up MySQL on same provider

---

## Step 7: Test Deployment

1. **Test Backend API:**
   ```
   https://logiedge-backend.onrender.com/api/health
   ```
   Should return: `{"status":"OK",...}`

2. **Test Frontend:**
   ```
   https://logiedge-frontend.onrender.com
   ```
   Should load dashboard

3. **Test API Connection:**
   ```
   https://logiedge-frontend.onrender.com/api/customers
   ```
   Should return customer list

---

## Pre-Deployment Checklist

- [ ] Render account created
- [ ] GitHub repository connected to Render
- [ ] MySQL database accessible (or set up)
- [ ] Supabase credentials ready
- [ ] `.env.production` created with correct API URL
- [ ] CORS updated with production URL
- [ ] Backend service deployed
- [ ] Frontend service deployed
- [ ] Health check passed
- [ ] Customer list loads from API

---

## Environment Variables Needed

### Backend (Render Environment)
```
PORT=10000
NODE_ENV=production
DB_HOST=your-database-host
DB_PORT=3306
DB_NAME=logiedge_billing
DB_USER=your-db-user
DB_PASSWORD=your-db-password
SUPABASE_URL=https://tipklyvuyztquifdbhyi.supabase.co
SUPABASE_ANON_KEY=sb_publishable_in9eE_GGT9fMWKuS03vnAg_fKz1Ty_X
```

### Frontend (Render Environment)
```
VITE_API_URL=https://logiedge-backend.onrender.com
VITE_SUPABASE_URL=https://tipklyvuyztquifdbhyi.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_in9eE_GGT9fMWKuS03vnAg_fKz1Ty_X
```

---

## Troubleshooting

### "Failed to fetch from API"
- ❌ CORS not configured
- ✅ Update `backend/src/server.js` and redeploy

### "Cannot connect to database"
- ❌ Database credentials wrong
- ✅ Verify DB host, port, user, password in environment

### "Storage upload fails"
- ❌ Supabase keys expired
- ✅ Regenerate keys in Supabase dashboard

### "Blank screen on frontend"
- ❌ API URL pointing to wrong backend
- ✅ Check `.env.production` has correct backend URL

### "Timeout on first load"
- ⚠️ Render free tier sleeps after 15 mins inactivity
- Update to paid plan to prevent sleep, or use pinging service

---

## Cost Estimation (Free Tier)

| Service | Cost | Note |
|---------|------|------|
| Backend (Web Service) | Free (sleeps after 15 min) | $7/mo for always-on |
| Frontend (Static Site) | Free | Includes bandwidth |
| MySQL Database | Free or $$ | Use managed service |
| Supabase Storage | Free tier generous | 1GB storage included |

---

## Post-Deployment

1. **Monitor Logs:**
   - Render Dashboard → Your Service → Logs
   - Check for errors, database connections, Supabase issues

2. **Enable Auto-Deploy:**
   - Settings → Auto-Deploy → Pick branch (`main`)
   - Automatically deploys on each git push

3. **Set Up Health Checks:**
   - Render will periodically call `/api/health`
   - Helps detect issues early

4. **Database Backups:**
   - Set up nightly backups for MySQL
   - Export from Render or MySQL service

---

## Files Already Ready for Render

✅ `backend/.env.render` - Template for configuration  
✅ `package.json` - Correct scripts (npm start)  
✅ Supabase integration complete  
✅ GitHub repository connected  

---

## Ready to Deploy!

You can now deploy your complete LogiEdge application to Render.

**Next Steps:**
1. Go to render.com
2. Follow Step 1-4 above
3. Your app is live! 🚀

Questions? Check Render docs: https://render.com/docs
