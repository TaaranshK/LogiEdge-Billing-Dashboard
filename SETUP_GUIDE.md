# LogiEdge Billing Dashboard - Setup & Migration Guide

## 📋 Project Overview

- **Tech Stack**: React (Frontend) + Node.js/Express (Backend) + MySQL (Database)
- **Purpose**: Comprehensive billing dashboard with Master module (Customers/Items) and invoicing system
- **Status**: Production Ready ✅

## 🔄 Migration Summary

- **FROM**: PostgreSQL with pg driver
- **TO**: MySQL with mysql2/promise driver
- **Changes**: Database schema, connection pooling, query syntax, transaction handling

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js v14+ and npm
- MySQL Server v5.7+ or MySQL 8.0+
- Git

### Step 1: Setup Database

```bash
# 1. Create MySQL database
mysql -u root -p

# In MySQL terminal:
CREATE DATABASE logiedge_billing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 2. Import schema
mysql -u root -p logiedge_billing < database/schema.sql
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies (IMPORTANT: mysql2 replaces pg)
npm install

# Configure environment variables
cp ../.env.example ../.env

# Edit .env with your MySQL credentials:
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=logiedge_billing
# DB_USER=root
# DB_PASSWORD=your_password
# PORT=5000

# Start backend server
npm run dev  # Development with nodemon
# OR
npm start    # Production mode
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend
cd frontend/frontend

# Install dependencies
npm install

# Configure environment (already set to localhost:5000/api)
# No changes needed if running locally

# Start frontend development server
npm run dev
```

### Step 4: Access Application

- **Frontend**: http://localhost:5173 (Vite default)
- **Backend**: http://localhost:5000
- **API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 📊 Database Schema

### Tables Overview

```
customers         → Customer master data with GST/PAN info
items             → Product/Item master data
invoices          → Invoice header with totals and GST
invoice_items     → Line items for each invoice
```

### Key Features

- ✅ Foreign Key constraints with ON DELETE RESTRICT/CASCADE
- ✅ Unique invoice ID enforcement
- ✅ Auto-increment primary keys
- ✅ Proper indexing for performance
- ✅ CHECK constraints for validation
- ✅ UTF-8 charset support

---

## 🔑 API Endpoints

### Customers

- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PATCH /api/customers/:id/status` - Update customer status

### Items

- `GET /api/items` - Get all items
- `GET /api/items/active` - Get active items only
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item
- `PATCH /api/items/:id/status` - Update item status

### Billing

- `POST /api/billing` - Create new invoice
- `GET /api/billing` - Get all invoices
- `GET /api/billing/search/:invoiceId` - Search invoice by ID
- `GET /api/billing/customer/:customerId` - Get customer's invoices

### Health Check

- `GET /api/health` - Server status

---

## 💡 Key Business Logic

### GST Calculation

```javascript
// If customer has GST number → Registered → 0% GST
// If customer has NO GST number → Not Registered → 18% GST

Example:
Customer: "ABC Corp" (GST Registered) + ₹1000 = ₹1000 (0% GST)
Customer: "XYZ Ltd" (Not Registered) + ₹1000 = ₹1180 (18% GST)
```

### Invoice ID Generation

- Format: `INVC` + 6-digit random number
- Example: `INVC284920`
- Always unique (checked before insertion)
- Length: 10 characters

### Validations

- ✅ Customer must be Active
- ✅ Items must be Active
- ✅ Quantity must be > 0
- ✅ Customer and Items must exist
- ✅ PAN format validation (if provided)

---

## 🔧 Code Architecture

### Backend Structure (MVC Pattern)

```
src/
  ├── config/db.js              → MySQL pool connection
  ├── controllers/              → HTTP request handlers
  ├── models/                   → Database queries (MySQL syntax)
  ├── routes/                   → API route definitions
  ├── services/                 → Business logic & validation
  ├── middlewares/              → Error handling
  └── server.js                 → Express app entry point
```

### Frontend Structure

```
src/
  ├── API/                      → Axios API wrappers
  ├── components/               → Reusable components
  ├── pages/                    → Page components
  ├── utils/                    → Helper utilities
  └── App.jsx                   → Main app component
```

---

## 🐛 Troubleshooting

### Error: "Connection refused"

```
❌ MySQL server not running
✅ Solution: Start MySQL service
  Windows: services.msc → Find MySQL → Start
  Linux: sudo systemctl start mysql
  Mac: mysql.server start
```

### Error: "Access denied for user 'root'@'localhost'"

```
❌ Wrong password in .env
✅ Solution: Update .env with correct MySQL password
```

### Error: "Unknown database 'logiedge_billing'"

```
❌ Database not created or schema not imported
✅ Solution: Run the database setup steps again
```

### Frontend can't reach backend

```
❌ CORS or API URL issue
✅ Solution: Verify VITE_API_URL in frontend/.env
  VITE_API_URL=http://localhost:5000/api
```

---

## 🔒 Security Notes

1. **Environment Variables**: Never commit .env file (add to .gitignore)
2. **Password**: Change default MySQL password in production
3. **Input Validation**: All inputs validated server-side
4. **SQL Injection**: Using parameterized queries (? placeholders)
5. **Error Handling**: Generic error messages (no SQL details leaked)

---

## 📈 Performance Features

- Connection pool for database efficiency
- Indexed columns for fast queries
- Transaction support for data consistency
- Proper foreign key constraints
- Async/await for non-blocking operations

---

## 🧪 Testing Checklist

- [ ] Backend health check endpoint works
- [ ] Can create customer via API
- [ ] Can create item via API
- [ ] Can create invoice with multiple items
- [ ] GST calculation correct for registered customers
- [ ] GST calculation correct for non-registered customers
- [ ] Invoice ID is unique
- [ ] Dashboard loads recent invoices
- [ ] Can search invoice by ID
- [ ] Can filter invoices by customer
- [ ] Frontend pagination/search works
- [ ] Error messages display correctly

---

## 📝 Sample Data

The database comes pre-populated with:

**Customers (5)**:

- Gupta Enterprise (GST Registered)
- Mahesh Industries (Not Registered)
- Omkar and Brothers (GST Registered)
- Bhuwan Infotech (GST Registered)
- Swastik Software (GST Registered)

**Items (6)**:

- Laptop (₹55,000)
- LED Monitor (₹12,000)
- Pen Drive (₹850)
- Mobile Phone (₹18,000)
- Headphones (₹3,500)
- Power Bank (₹2,200)

---

## 🚢 Deployment Notes

### For Production:

1. Use environment-specific .env files
2. Set NODE_ENV=production
3. Use strong MySQL passwords
4. Enable MySQL encryption for sensitive data
5. Use HTTPS for API calls
6. Add CORS whitelist for specific domains
7. Consider using process manager like PM2

### Example PM2 startup:

```bash
npm install -g pm2
pm2 start src/server.js --name "logiEdge-backend"
pm2 startup
pm2 save
```

---

## 📞 Support

For issues or questions:

1. Check the Troubleshooting section
2. Review error logs in console
3. Verify .env configuration
4. Check MySQL connection status

---

## 📄 License & Version

- **Version**: 1.0.0 (Production Ready)
- **Last Updated**: 2024
- **Database Revision**: MySQL v1

---

## ✅ Changelog

### v1.0.0 - Initial Release

- ✅ Migrated from PostgreSQL to MySQL
- ✅ Fixed all backend syntax errors
- ✅ Completed billing service logic
- ✅ Added transaction support
- ✅ Improved error handling
- ✅ Added comprehensive documentation

---

**Happy Billing! 🎉**
