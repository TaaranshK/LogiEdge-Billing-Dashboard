# Supabase Integration - Your Project Setup

## Project Architecture

Your project uses **React + Vite** (Frontend) + **Express** (Backend), not Next.js.

### Environment Variables

| Component | File | Variable | Format |
|-----------|------|----------|--------|
| **Frontend (Vite)** | `frontend/frontend/.env.local` | `VITE_SUPABASE_URL` | `VITE_` prefix required |
| **Frontend (Vite)** | `frontend/frontend/.env.local` | `VITE_SUPABASE_ANON_KEY` | `VITE_` prefix required |
| **Backend (Express)** | `backend/.env` | `SUPABASE_URL` | No prefix needed |
| **Backend (Express)** | `backend/.env` | `SUPABASE_ANON_KEY` | No prefix needed |

### Vite Note
Vite only exposes variables with `VITE_` prefix to the browser. This is why frontend uses `VITE_SUPABASE_*` while backend uses `SUPABASE_*`.

---

## What's Already Set Up ✅

### Backend Files
```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js          (Supabase client)
│   ├── services/
│   │   └── storageService.js    (Upload, Delete, List, URL)
│   └── routes/
│       └── storageRoutes.js     (API endpoints)
└── .env                          (Add credentials here)
```

### Frontend Files
```
frontend/frontend/
├── src/
│   └── API/
│       └── storageapi.js        (React wrapper)
├── .env.local                    (Add credentials here)
└── .env.example                  (Reference)
```

---

## Installation Steps

### 1. Add Credentials to Backend

Edit `backend/.env`:

```env
PORT=5000

# MySQL connection details
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=logiedge_billing
DB_USER=root
DB_PASSWORD=Guddiguddi13@

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Add Credentials to Frontend

Edit `frontend/frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:5000
```

### 3. Create Supabase Buckets

1. Go to Supabase Dashboard → **Storage**
2. Create public buckets:
   - `invoices` - for PDF invoices
   - `customer-docs` - for customer documents
   - `attachments` - for all file attachments

---

## Using Supabase Storage

### Frontend Example (React)

```javascript
import { uploadToStorage, deleteFromStorage } from '../../API/storageapi'

export const InvoiceUpload = () => {
  const handleUpload = async (e) => {
    const file = e.target.files[0]
    
    // Upload to Supabase
    const result = await uploadToStorage(
      'invoices',
      `invoice-${Date.now()}.pdf`,
      file
    )
    
    if (result.success) {
      console.log('Public URL:', result.url)
      // Save to database
      saveInvoiceURL(result.url)
    } else {
      console.error('Upload failed:', result.error)
    }
  }

  return (
    <input 
      type="file" 
      accept=".pdf"
      onChange={handleUpload}
    />
  )
}
```

### Backend Example (Express)

```javascript
router.post('/invoices/:id/upload', async (req, res) => {
  const { file } = req.body // base64 file data
  
  const result = await uploadFile(
    'invoices',
    `invoice-${req.params.id}.pdf`,
    Buffer.from(file, 'base64')
  )

  if (result.success) {
    res.json({ success: true, url: result.url })
  } else {
    res.status(400).json({ success: false, error: result.error })
  }
})
```

---

## API Endpoints

All endpoints are at `http://localhost:5000/api/storage/`

### 1. Upload File
```
POST /api/storage/upload
Content-Type: application/json

{
  "bucket": "invoices",
  "path": "invoice-12345.pdf",
  "file": "base64-encoded-data"
}

Response:
{
  "success": true,
  "url": "https://...", 
  "path": "invoice-12345.pdf"
}
```

### 2. Delete File
```
DELETE /api/storage/delete
Content-Type: application/json

{
  "bucket": "invoices",
  "path": "invoice-12345.pdf"
}

Response:
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 3. List Files
```
GET /api/storage/list/invoices?path=2026/04/

Response:
{
  "success": true,
  "files": [...],
  "count": 5
}
```

### 4. Get Public URL
```
GET /api/storage/url/invoices/invoice-12345.pdf

Response:
{
  "success": true,
  "url": "https://your-project.supabase.co/storage/v1/object/public/invoices/..."
}
```

---

## Start Servers

```bash
# Terminal 1: Backend
cd backend
npm start
# Output: "LogiEdge backend is up and running!"

# Terminal 2: Frontend
cd frontend/frontend
npm run dev
# Output: "VITE ... ready in 200ms"
```

Visit: http://localhost:5173

---

## Troubleshooting

### "Supabase credentials not configured"
- ❌ Missing `SUPABASE_URL` or `SUPABASE_ANON_KEY` in `.env`
- ✅ Add credentials and restart backend: `npm start`

### "CORS error when uploading"
- Go to Supabase Settings → CORS
- Add: `http://localhost:5174`

### "401 Unauthorized"
- ❌ Wrong API key
- ✅ Copy exact keys from Supabase → Settings → API

### "Cannot find file"
- ❌ Bucket doesn't exist
- ✅ Create bucket in Supabase Storage first

---

## Security Best Practices

⚠️ **Remember:**
1. **Never commit `.env` files** to git
2. **Use `.env.example`** as template
3. **Rotate API keys** regularly
4. **Use Row Level Security (RLS)** for sensitive data
5. **Keep credentials secret** - use different keys for prod/dev

---

## Next Steps

1. ✅ Get Supabase credentials
2. ✅ Add to `.env` files
3. ✅ Create storage buckets
4. ✅ Restart servers
5. ✅ Test upload in React component
6. ✅ Display uploaded files

---

**Questions?** Check [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
