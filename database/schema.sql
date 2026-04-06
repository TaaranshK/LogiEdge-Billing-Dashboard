-- MySQL Database Schema for LogiEdge Billing Dashboard
-- Tables: customers, items, invoices, invoice_items

DROP TABLE IF EXISTS invoice_items;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS customers;

-- ============================================
-- TABLE 1: CUSTOMERS
-- ============================================
-- Stores customer master data
-- Columns: id, customer_name, address, pan_number, gst_number, status, created_at

CREATE TABLE customers (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 2: ITEMS
-- ============================================
-- Stores product/item master data for billing
-- Columns: id, item_name, selling_price, status, created_at

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL CHECK (selling_price > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'Active'
        CHECK (status IN ('Active', 'In-Active')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_item_name (item_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 3: INVOICES
-- ============================================
-- Stores invoice records
-- Each invoice belongs to one customer and can have multiple items
-- Columns: id, invoice_id, customer_id, subtotal, gst_rate, gst_amount, total_amount, created_at

CREATE TABLE invoices (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 4: INVOICE_ITEMS
-- ============================================
-- Stores line items for each invoice
-- Each row represents one item on an invoice
-- Columns: id, invoice_id, item_id, item_name, quantity, unit_price, total_price

CREATE TABLE invoice_items (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Sample Customers
INSERT INTO customers (customer_name, address, pan_number, gst_number, status) VALUES
('Gupta Enterprise Pvt. Ltd.', 'Mumbai, Maharashtra', 'AABCG1234F', '27AABCG1234F1Z5', 'Active'),
('Mahesh Industries Pvt. Ltd.', 'Pune, Maharashtra', 'AABCM5678G', NULL, 'In-Active'),
('Omkar and Brothers Pvt. Ltd.', 'Nagpur, Maharashtra', 'AABCO9012H', '27AABCO9012H1Z3', 'Active'),
('Bhuwan Infotech.', 'Nashik, Maharashtra', 'AABCB3456I', '27AABCB3456I1Z1', 'Active'),
('Swastik Software Pvt. Ltd.', 'Aurangabad, Maharashtra', 'AABCS7890J', '27AABCS7890J1Z9', 'Active');

-- Sample Items
INSERT INTO items (item_name, selling_price, status) VALUES
('Laptop', 55000.00, 'Active'),
('LED Monitor', 12000.00, 'Active'),
('Pen Drive', 850.00, 'Active'),
('Mobile Phone', 18000.00, 'Active'),
('Headphones', 3500.00, 'In-Active'),
('Power Bank', 2200.00, 'Active');

SELECT 'MySQL Schema created successfully! Tables: customers, items, invoices, invoice_items' AS status;