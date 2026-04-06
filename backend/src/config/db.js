// This File Connects with MySQL Database and exports connection pool
// 'mysql2/promise' provides Promise-based MySQL client for Node.js

const mysql = require('mysql2/promise');

// Create connection pool for better performance
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'logiedge_billing',
    user: process.env.DB_USER || 'root',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelayMs: 0
};

// Only add password if provided in .env
if (process.env.DB_PASSWORD) {
    poolConfig.password = process.env.DB_PASSWORD;
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;
