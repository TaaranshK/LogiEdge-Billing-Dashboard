# Deploy Frontend on Vercel + Backend on Render

## Quick Summary

| Component             | Host       | URL                                     |
| --------------------- | ---------- | --------------------------------------- |
| Frontend (React/Vite) | **Vercel** | `https://logiedge.vercel.app`           |
| Backend (Express API) | **Render** | `https://logiedge-backend.onrender.com` |
| MySQL Database        | Your host  | `your-db-host.com:3306`                 |
| Supabase Storage      | Supabase   | `tipklyvuyztquifdbhyi.supabase.co`      |

---

## Step 1: Deploy Backend to Render

✅ **Already Done or Prepared:**

1. Go to **render.com** → **New** → **Web Service**
2. Connect: `TaaranshK/LogiEdge-Billing-Dashboard`
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`

**Environment Variables:**

```
PORT=10000
NODE_ENV=production
DB_HOST=your-mysql-host
DB_PORT=3306
DB_NAME=logiedge_billing
DB_USER=your-db-user
DB_PASSWORD=your-db-password
SUPABASE_URL=https://tipklyvuyztquifdbhyi.supabase.co
SUPABASE_ANON_KEY=sb_publishable_in9eE_GGT9fMWKuS03vnAg_fKz1Ty_X
```

**Get your Backend URL after deploy:**

- Example: `https://logiedge-backend.onrender.com`

---

## Step 2: Deploy Frontend to Vercel

### 2a. Connect Vercel to GitHub

1. Go to **vercel.com**
2. Click **+ New Project**
3. Click **Import Git Repository**
4. Search for: `LogiEdge-Billing-Dashboard`
5. Select your repo and click **Import**

### 2b. Configure Project

| Field                | Value               |
| -------------------- | ------------------- |
| **Project Name**     | `logiedge-frontend` |
| **Framework Preset** | `Vite`              |
| **Root Directory**   | `frontend/frontend` |
| **Build Command**    | `npm run build`     |
| **Output Directory** | `dist`              |

### 2c. Add Environment Variables

Click **Environment Variables** and add:

```
VITE_API_URL=https://logiedge-backend.onrender.com
VITE_SUPABASE_URL=https://tipklyvuyztquifdbhyi.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_in9eE_GGT9fMWKuS03vnAg_fKz1Ty_X
```

### 2d. Deploy

Click **Deploy** and wait for completion.

**Get your Frontend URL:**

- Example: `https://logiedge-frontend.vercel.app`

---

## Step 3: Verify Deployment

### Test Backend

```
https://logiedge-backend.onrender.com/api/health
```

Should return: `{"status":"OK",...}`

### Test Frontend

```
https://logiedge-frontend.vercel.app
```

Should load dashboard without "Cannot GET /" error

### Test API Connection

Visit frontend and:

1. Check Dashboard - Should load your customer stats
2. Go to Master → Customers - Should display all customers from database
3. Upload file to Supabase - Should work
4. Create invoice - Should connect to backend

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    User's Browser                    │
└─────────────────┬───────────────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
    ┌─────────┐      ┌────────────┐
    │ Vercel  │      │   Render   │
    │Frontend │      │ Backend    │
    │ (React) │      │ (Express)  │
    └────┬────┘      └────┬───────┘
         │                │
         └────────┬───────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
    ┌─────────┐      ┌──────────┐
    │Supabase │      │  MySQL   │
    │ Storage │      │Database  │
    └─────────┘      └──────────┘
```

---

## Benefits of This Setup

✅ **Vercel:**

- Optimized for React/Vite SPAs
- Automatic builds on every git push
- Sexy deployments (preview URLs)
- Global edge caching
- Free tier available

✅ **Render:**

- Great for Node.js backends
- PostgreSQL, MySQL support
- Easy environment variables
- Health checks included
- Good uptime

✅ **Combined:**

- Best tool for each job
- Easy to scale independently
- Better performance
- Separate concerns (frontend/backend)

---

## Auto-Deploy on Git Push

Both Vercel and Render automatically deploy when you push to GitHub branch `main`.

```bash
# Any push automatically triggers:
git add .
git commit -m "Update code"
git push origin main

# ✅ Vercel rebuilds frontend in 1-2 min
# ✅ Render rebuilds backend in 2-3 min
```

---

## Troubleshooting

### "Cannot GET /" on Vercel

- ✅ Already fixed with `vercel.json` configuration
- Vercel now routes all requests to `index.html`

### "CORS Error" API calls

- ✅ Backend CORS already configured for Vercel domains
- Check browser console for exact error

### "Cannot connect to backend"

- Verify `VITE_API_URL` matches your Render backend URL
- Check Render backend logs for errors

### "Database connection failed"

- Verify DB credentials in Render environment variables
- Check database is accessible from Render (not localhost)

---

## Next Steps

1. ✅ Deploy backend to Render (if not done)
2. ✅ Deploy frontend to Vercel (if not done)
3. ✅ Get both URLs
4. ✅ Test all features
5. ✅ Monitor logs on both platforms

---

## Files Changed for This Setup

✅ `backend/src/server.js` - Updated CORS for Vercel  
✅ `frontend/frontend/vercel.json` - Vercel configuration  
✅ Removed `frontend/frontend/server.js` - Not needed with Vercel  
✅ Updated `frontend/frontend/package.json` - Removed "start" script

All ready to deploy! 🚀
