-- =========================================================
-- CaféSense Database Schema & Seed Data
-- =========================================================

CREATE DATABASE IF NOT EXISTS CafeSenseDB;
USE CafeSenseDB;

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT IGNORE INTO roles (role_id, role_name) VALUES
(1, 'Owner'),
(2, 'Manager'),
(3, 'Staff');

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    account_status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Passwords are: Owner123, Manager123, Staff123 (hashed with bcrypt)
INSERT IGNORE INTO users (user_id, role_id, full_name, username, email, password_hash, account_status) VALUES
(1, 1, 'Café Owner', 'owner', 'owner@cafesense.com', '$2b$10$tT1d4i.D66FhW59Uzk0lK.G1tW80kO3rQ11uOqD6bXWv5dM3rLq3G', 'Active'),
(2, 2, 'Café Manager', 'manager', 'manager@cafesense.com', '$2b$10$Y1wH1rI31e1Z8gB27mHk.eH5jB4k0qT12uPpA5aXWv4cM2rKq2F', 'Active'),
(3, 3, 'Café Staff', 'staff', 'staff@cafesense.com', '$2b$10$5Uzkvh6l/gQoWOfEoNNvxuhmTRt/e80oVc3kFPIHc8wuCoJwYwQme', 'Active');

-- 3. PRODUCT CATEGORIES
CREATE TABLE IF NOT EXISTS product_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT IGNORE INTO product_categories (category_id, category_name) VALUES
(1, 'Coffee'),
(2, 'Non-Coffee'),
(3, 'Pastry / Baked Good');

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    availability ENUM('Available', 'Unavailable') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(category_id)
);

INSERT IGNORE INTO products (product_id, category_id, product_name, price, stock_quantity, availability) VALUES
(1, 1, 'Café Latte', 120.00, 35, 'Available'),
(2, 1, 'Americano', 100.00, 28, 'Available'),
(3, 1, 'Cappuccino', 130.00, 22, 'Available'),
(4, 1, 'Caramel Macchiato', 145.00, 18, 'Available'),
(5, 1, 'Spanish Latte', 140.00, 30, 'Available'),
(6, 2, 'Matcha Latte', 170.00, 20, 'Available'),
(7, 2, 'Chocolate Milk', 110.00, 25, 'Available'),
(8, 2, 'Strawberry Milk', 120.00, 16, 'Available'),
(9, 3, 'Blueberry Cheesecake', 150.00, 12, 'Available'),
(10, 3, 'Chocolate Muffin', 85.00, 24, 'Available'),
(11, 3, 'Croissant', 95.00, 20, 'Available'),
(12, 3, 'Chocolate Chip Cookie', 65.00, 40, 'Available');

-- 5. CUSTOMER TYPES
CREATE TABLE IF NOT EXISTS customer_types (
    customer_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    discount_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00
);

INSERT IGNORE INTO customer_types (customer_type_id, type_name, discount_percentage) VALUES
(1, 'General Customer', 0.00),
(2, 'Student', 10.00),
(3, 'Senior/PWD', 20.00);

-- 6. PAYMENT METHODS
CREATE TABLE IF NOT EXISTS payment_methods (
    payment_method_id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE
);

INSERT IGNORE INTO payment_methods (payment_method_id, method_name, is_active) VALUES
(1, 'Cash', TRUE),
(2, 'GCash', TRUE),
(3, 'Maya', TRUE),
(4, 'Card', TRUE);

-- 7. TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_code VARCHAR(30) NOT NULL UNIQUE,
    user_id INT,
    customer_type_id INT,
    payment_method_id INT,
    customer_count INT DEFAULT 1,
    subtotal DECIMAL(10,2) NOT NULL,
    total_discount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    change_given DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (customer_type_id) REFERENCES customer_types(customer_type_id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id)
);

-- 8. TRANSACTION ITEMS
CREATE TABLE IF NOT EXISTS transaction_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    product_id INT NOT NULL,
    customer_type_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 9. INVENTORY MOVEMENTS
CREATE TABLE IF NOT EXISTS inventory_movements (
    movement_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    transaction_id INT NULL,
    movement_type ENUM('Sale', 'Restock', 'Adjustment', 'Damage/Loss') NOT NULL,
    quantity_changed INT NOT NULL,
    stock_before INT NOT NULL,
    stock_after INT NOT NULL,
    reason VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);
