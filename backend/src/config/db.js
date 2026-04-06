// PostgreSQL Connection Pool for Supabase
// 'pg' provides Promise-based PostgreSQL client for Node.js

const { Pool } = require('pg');

// Create connection pool for better performance
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('supabase') ? { rejectUnauthorized: false } : false
};

const pool = new Pool(poolConfig);

// Test connection on startup
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

module.exports = pool;
