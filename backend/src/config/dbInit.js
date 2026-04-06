// Database Initialization for PostgreSQL/Supabase
// Auto-creates tables if they don't exist on first run

const pool = require('./db');

const initializeDatabase = async () => {
    const client = await pool.connect();
    try {
        console.log(' Initializing PostgreSQL database...');

        // Step 1: Create all tables (PostgreSQL will create if not exist)
        console.log(' Creating/verifying tables...');

        // Table 1: Customers
        await client.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id SERIAL PRIMARY KEY,
                customer_name VARCHAR(150) NOT NULL,
                address TEXT,
                pan_number VARCHAR(20),
                gst_number VARCHAR(20),
                status VARCHAR(20) NOT NULL DEFAULT 'Active'
                    CHECK (status IN ('Active', 'In-Active')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
            CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(customer_name);
        `);

        // Table 2: Items
        await client.query(`
            CREATE TABLE IF NOT EXISTS items (
                id SERIAL PRIMARY KEY,
                item_name VARCHAR(150) NOT NULL,
                selling_price DECIMAL(10, 2) NOT NULL CHECK (selling_price > 0),
                status VARCHAR(20) NOT NULL DEFAULT 'Active'
                    CHECK (status IN ('Active', 'In-Active')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
            CREATE INDEX IF NOT EXISTS idx_items_name ON items(item_name);
        `);

        // Table 3: Invoices
        await client.query(`
            CREATE TABLE IF NOT EXISTS invoices (
                id SERIAL PRIMARY KEY,
                invoice_id VARCHAR(10) UNIQUE NOT NULL,
                customer_id INT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
                subtotal DECIMAL(12, 2) NOT NULL,
                gst_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
                gst_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
                total_amount DECIMAL(12, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_invoices_id ON invoices(invoice_id);
            CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
            CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
        `);

        // Table 4: Invoice Items
        await client.query(`
            CREATE TABLE IF NOT EXISTS invoice_items (
                id SERIAL PRIMARY KEY,
                invoice_id VARCHAR(10) NOT NULL REFERENCES invoices(invoice_id) ON DELETE CASCADE ON UPDATE CASCADE,
                item_id INT NOT NULL REFERENCES items(id) ON DELETE RESTRICT ON UPDATE CASCADE,
                item_name VARCHAR(150) NOT NULL,
                quantity INT NOT NULL CHECK (quantity > 0),
                unit_price DECIMAL(10, 2) NOT NULL,
                total_price DECIMAL(12, 2) NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
            CREATE INDEX IF NOT EXISTS idx_invoice_items_item_id ON invoice_items(item_id);
        `);

        console.log(' Tables created/verified successfully!');

        // Step 2: Insert sample data (only if tables are empty)
        console.log(' Checking for sample data...');

        const customerCount = await client.query('SELECT COUNT(*) FROM customers');
        
        if (parseInt(customerCount.rows[0].count) === 0) {
            console.log(' Inserting sample data...');

            // Insert sample customers
            await client.query(`
                INSERT INTO customers (customer_name, address, pan_number, gst_number, status) VALUES
                ('Gupta Enterprise Pvt. Ltd.', 'Mumbai, Maharashtra', 'AABCG1234F', '27AABCG1234F1Z5', 'Active'),
                ('Mahesh Industries Pvt. Ltd.', 'Pune, Maharashtra', 'AABCM5678G', NULL, 'In-Active'),
                ('Omkar and Brothers Pvt. Ltd.', 'Nagpur, Maharashtra', 'AABCO9012H', '27AABCO9012H1Z3', 'Active'),
                ('Bhuwan Infotech.', 'Nashik, Maharashtra', 'AABCB3456I', '27AABCB3456I1Z1', 'Active'),
                ('Swastik Software Pvt. Ltd.', 'Aurangabad, Maharashtra', 'AABCS7890J', '27AABCS7890J1Z9', 'Active')
                ON CONFLICT DO NOTHING
            `);

            // Insert sample items
            await client.query(`
                INSERT INTO items (item_name, selling_price, status) VALUES
                ('Laptop', 55000.00, 'Active'),
                ('LED Monitor', 12000.00, 'Active'),
                ('Pen Drive', 850.00, 'Active'),
                ('Mobile Phone', 18000.00, 'Active'),
                ('Headphones', 3500.00, 'In-Active'),
                ('Power Bank', 2200.00, 'Active')
                ON CONFLICT DO NOTHING
            `);

            console.log(' Sample data inserted successfully!');
        } else {
            console.log(' Sample data already exists, skipping insert');
        }

        console.log(' Database initialization complete! ✅');

    } catch (error) {
        console.error('⚠️  Database initialization error:');
        console.error(error.message);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = initializeDatabase;
