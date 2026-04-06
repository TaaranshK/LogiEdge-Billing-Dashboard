# Supabase Credentials Configuration - React/Vite + Express

## Frontend (.env.local for Vite)

Create `frontend/frontend/.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Vite uses `VITE_` prefix for public environment variables.

## Backend (.env for Express)

Update `backend/.env`:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## Steps to Get Your Credentials

1. Go to [supabase.com](https://supabase.com) → Sign in
2. Open your project
3. Click **Settings** → **API** (left sidebar)
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **Anon (public) Key** → `SUPABASE_ANON_KEY`

## Files Already Set Up

✅ **Backend:**

- `src/config/supabase.js` - Supabase client initialization
- `src/services/storageService.js` - File operations (upload, delete, list)
- `src/routes/storageRoutes.js` - API endpoints

✅ **Frontend:**

- `src/API/storageapi.js` - React-friendly Supabase wrapper

## Usage

### Frontend (React)

```javascript
import { uploadToStorage } from "../../API/storageapi";

// Upload invoice
const result = await uploadToStorage("invoices", "invoice-12345.pdf", file);

if (result.success) {
  console.log("URL:", result.url);
}
```

### Backend (Express)

Call the API directly:

```javascript
const response = await fetch("http://localhost:5000/api/storage/upload", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    bucket: "invoices",
    path: "invoice-12345.pdf",
    file: base64Data,
  }),
});
```

## Next Actions

1. **Add credentials to both `.env` files**
2. **Create Supabase storage buckets:**
   - Go to Storage in Supabase dashboard
   - New bucket: `invoices` (public)
   - New bucket: `customer-docs` (public)
   - New bucket: `attachments` (public)
3. **Restart servers:**

   ```bash
   # Backend
   cd backend && npm start

   # Frontend (new terminal)
   cd frontend/frontend && npm run dev
   ```

4. **Test upload:**

   ```javascript
   // In React component
   import { uploadToStorage } from "../../API/storageapi";

   const handleUpload = async (file) => {
     const result = await uploadToStorage("invoices", file.name, file);
     console.log(result);
   };
   ```

---

**Note:** This is adapted for your React/Vite + Express stack (not Next.js). The official instructions were for Next.js, but the same Supabase principles apply.
