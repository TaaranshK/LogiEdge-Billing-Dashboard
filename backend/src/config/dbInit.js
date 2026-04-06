// Database Initialization - Auto-creates database and tables if they don't exist
// This runs once when the server starts

const mysql = require('mysql2/promise');

const initializeDatabase = async () => {
    let connection;
    try {
        console.log(' Initializing database...');

        const dbName = process.env.DB_NAME || 'logiedge_billing';

        // Step 1: Create a temporary connection to create the database
        console.log(' Connecting to MySQL server...');
        
        const connectionConfig = {
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root'
        };
        
        // Only add password if it's provided (not empty)
        if (process.env.DB_PASSWORD) {
            connectionConfig.password = process.env.DB_PASSWORD;
        }
        
        connection = await mysql.createConnection(connectionConfig);

        console.log(' Connected to MySQL');

        // Step 2: Create database if it doesn't exist
        console.log(` Creating database: ${dbName}...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} 
            CHARACTER SET utf8mb4 
            COLLATE utf8mb4_unicode_ci`);
        console.log(` Database ${dbName} ready`);

        // Step 3: Select the database
        await connection.query(`USE ${dbName}`);

        // Step 4: Drop all existing tables (in reverse dependency order)
        console.log('🗑️  Dropping existing tables...');
        const dropStatements = [
            `DROP TABLE IF EXISTS invoice_items`,
            `DROP TABLE IF EXISTS invoices`,
            `DROP TABLE IF EXISTS items`,
            `DROP TABLE IF EXISTS customers`
        ];
        
        for (const dropStatement of dropStatements) {
            await connection.query(dropStatement);
        }
        console.log(' All tables dropped successfully!');

        // Step 5: Create all tables
        console.log(' Creating tables...');

        const schemas = [
            // Table 1: Customers
            `CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_name VARCHAR(150) NOT NULL,
                address TEXT,
                pan_number VARCHAR(20),
                gst_number VARCHAR(20),
                status VARCHAR(20) NOT NULL DEFAULT 'Active'
                    CHECK (status IN ('Active', 'In-Active')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_status (status),
                INDEX idx_customer_name (customer_name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

            // Table 2: Items
            `CREATE TABLE IF NOT EXISTS items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                item_name VARCHAR(150) NOT NULL,
                selling_price DECIMAL(10, 2) NOT NULL CHECK (selling_price > 0),
                status VARCHAR(20) NOT NULL DEFAULT 'Active'
                    CHECK (status IN ('Active', 'In-Active')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_status (status),
                INDEX idx_item_name (item_name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

            // Table 3: Invoices
            `CREATE TABLE IF NOT EXISTS invoices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                invoice_id VARCHAR(10) UNIQUE NOT NULL,
                customer_id INT NOT NULL,
                subtotal DECIMAL(12, 2) NOT NULL,
                gst_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
                gst_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
                total_amount DECIMAL(12, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_invoices_customer FOREIGN KEY (customer_id)
                    REFERENCES customers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
                INDEX idx_invoice_id (invoice_id),
                INDEX idx_customer_id (customer_id),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

            // Table 4: Invoice Items
            `CREATE TABLE IF NOT EXISTS invoice_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                invoice_id VARCHAR(10) NOT NULL,
                item_id INT NOT NULL,
                item_name VARCHAR(150) NOT NULL,
                quantity INT NOT NULL CHECK (quantity > 0),
                unit_price DECIMAL(10, 2) NOT NULL,
                total_price DECIMAL(12, 2) NOT NULL,
                CONSTRAINT fk_invoice_items_invoice FOREIGN KEY (invoice_id)
                    REFERENCES invoices(invoice_id) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT fk_invoice_items_item FOREIGN KEY (item_id)
                    REFERENCES items(id) ON DELETE RESTRICT ON UPDATE CASCADE,
                INDEX idx_invoice_id (invoice_id),
                INDEX idx_item_id (item_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
        ];

        // Create all tables
        for (const schema of schemas) {
            await connection.query(schema);
        }

        console.log(' All tables created/verified successfully!');

        // Step 6: Insert fresh sample data
        console.log(' Inserting sample data...');

        // Insert sample customers
        await connection.query(`
            INSERT INTO customers (customer_name, address, pan_number, gst_number, status) VALUES
            ('Gupta Enterprise Pvt. Ltd.', 'Mumbai, Maharashtra', 'AABCG1234F', '27AABCG1234F1Z5', 'Active'),
            ('Mahesh Industries Pvt. Ltd.', 'Pune, Maharashtra', 'AABCM5678G', NULL, 'In-Active'),
            ('Omkar and Brothers Pvt. Ltd.', 'Nagpur, Maharashtra', 'AABCO9012H', '27AABCO9012H1Z3', 'Active'),
            ('Bhuwan Infotech.', 'Nashik, Maharashtra', 'AABCB3456I', '27AABCB3456I1Z1', 'Active'),
            ('Swastik Software Pvt. Ltd.', 'Aurangabad, Maharashtra', 'AABCS7890J', '27AABCS7890J1Z9', 'Active')
        `);

        // Insert sample items
        await connection.query(`
            INSERT INTO items (item_name, selling_price, status) VALUES
            ('Laptop', 55000.00, 'Active'),
            ('LED Monitor', 12000.00, 'Active'),
            ('Pen Drive', 850.00, 'Active'),
            ('Mobile Phone', 18000.00, 'Active'),
            ('Headphones', 3500.00, 'In-Active'),
            ('Power Bank', 2200.00, 'Active')
        `);

        console.log(' Sample data inserted successfully!');

        await connection.end();
        console.log(' Database initialization complete!');

    } catch (error) {
        console.error(' Database initialization error:');
        console.error(error.message);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (e) {
                // Ignore close errors
            }
        }
    }
};

module.exports = initializeDatabase;
