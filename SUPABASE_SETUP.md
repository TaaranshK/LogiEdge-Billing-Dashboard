# Supabase Integration Guide

Your LogiEdge Billing Dashboard now has **Supabase Storage** functionality integrated! This guide will help you set up and use it.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details and create

### 2. Get Your Credentials

1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy:
   - **Project URL** (your `SUPABASE_URL`)
   - **Anon Key** (your `SUPABASE_ANON_KEY`)

### 3. Add Credentials to .env

Edit `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create Storage Buckets

1. In Supabase dashboard, go to "Storage"
2. Create buckets (recommended):
   - `invoices` - for PDF invoices
   - `customer-docs` - for customer documents
   - `attachments` - for general files

Make buckets **public** if you want direct URL access.

### 5. Restart Backend

```bash
cd backend
npm start
```

## Usage

### Backend API Endpoints

#### Upload File
```javascript
POST /api/storage/upload
Content-Type: application/json

{
  "bucket": "invoices",
  "path": "invoice-2026-04-06.pdf",
  "file": "base64-encoded-file-data"
}
```

Response:
```json
{
  "success": true,
  "url": "https://your-project.supabase.co/storage/v1/object/public/invoices/...",
  "path": "invoice-2026-04-06.pdf"
}
```

#### Delete File
```javascript
DELETE /api/storage/delete
Content-Type: application/json

{
  "bucket": "invoices",
  "path": "invoice-2026-04-06.pdf"
}
```

#### List Files
```javascript
GET /api/storage/list/invoices?path=2026/04/
```

#### Get Public URL
```javascript
GET /api/storage/url/invoices/invoice-2026-04-06.pdf
```

### Frontend Usage

Import the storage API:

```javascript
import {
  uploadToStorage,
  deleteFromStorage,
  listStorageFiles,
  getStorageURL
} from '../../API/storageapi'
```

#### Upload Invoice

```javascript
const handleUploadInvoice = async (file) => {
  try {
    const result = await uploadToStorage(
      'invoices',
      `invoice-${invoiceId}.pdf`,
      file
    )

    if (result.success) {
      console.log('Uploaded:', result.url)
      // Save URL to database
      saveInvoiceURL(invoiceId, result.url)
    }
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
```

#### Delete Invoice

```javascript
const handleDeleteInvoice = async (invoiceId) => {
  const result = await deleteFromStorage(
    'invoices',
    `invoice-${invoiceId}.pdf`
  )

  if (result.success) {
    console.log('Deleted successfully')
  }
}
```

#### List Customer Documents

```javascript
const handleListDocs = async (customerId) => {
  const result = await listStorageFiles(
    'customer-docs',
    `customer-${customerId}/`
  )

  if (result.success) {
    console.log('Files:', result.files) // Array of files
    console.log('Count:', result.count)
  }
}
```

## Current Features

✅ **Database Storage** - Store files in Supabase  
✅ **File Upload** - Upload from frontend  
✅ **Public URLs** - Generate shareable links  
✅ **File Management** - Delete and list files  
✅ **Async Initialization** - Graceful fallback if credentials missing  

## Future Enhancements

- [ ] Multi-file upload
- [ ] Progress tracking
- [ ] Signed URLs (private files)
- [ ] Image optimization
- [ ] Automatic backups

## Troubleshooting

### "Supabase credentials not configured"
- Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `backend/.env`
- Restart backend: `npm start`

### "Upload failed: 401"
- Check that API key is correct
- Verify bucket exists and is accessible

### "CORS error"
- In Supabase, go to Settings → CORS
- Add your frontend URL: `http://localhost:5174`

## Security Notes

⚠️ **Important:**
- Never commit real API keys to git
- Use `.env.example` as template
- Rotate keys regularly in Supabase dashboard
- Use Row Level Security (RLS) for sensitive files
- Implement proper authentication before file access

## Need Help?

- [Supabase Docs](https://supabase.com/docs)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- Check backend logs: `npm start` shows initialization status

---

**Ready to use?** Add your Supabase credentials to `.env` and restart the backend! 🚀
