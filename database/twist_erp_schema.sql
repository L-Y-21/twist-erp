-- =====================================================
-- TWIST ERP - Complete Database Schema
-- Construction Company Management System
-- =====================================================

-- =====================================================
-- SYSTEM CONFIGURATION TABLES
-- =====================================================

-- Companies/Organizations Table
CREATE TABLE companies (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_code VARCHAR(20) UNIQUE NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    legal_name VARCHAR(200),
    tax_id VARCHAR(50),
    registration_number VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    website VARCHAR(100),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    logo_url TEXT,
    primary_color VARCHAR(10) DEFAULT '#059669',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    INDEX idx_company_code (company_code),
    INDEX idx_company_active (is_active)
);

-- Branches Table
CREATE TABLE branches (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_code VARCHAR(20) NOT NULL,
    branch_name VARCHAR(200) NOT NULL,
    manager_id VARCHAR(36),
    email VARCHAR(100),
    phone VARCHAR(20),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_branch_code (company_id, branch_code),
    INDEX idx_branch_company (company_id),
    INDEX idx_branch_active (is_active)
);

-- =====================================================
-- USER MANAGEMENT & SECURITY
-- =====================================================

-- Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (CONCAT(first_name, ' ', last_name)) STORED,
    phone VARCHAR(20),
    avatar_url TEXT,
    role_id VARCHAR(36),
    employee_id VARCHAR(36),
    is_system_user BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    password_changed_at TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    INDEX idx_user_company (company_id),
    INDEX idx_user_branch (branch_id),
    INDEX idx_user_email (email),
    INDEX idx_user_username (username),
    INDEX idx_user_active (is_active)
);

-- Roles Table
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_name (company_id, role_name),
    INDEX idx_role_company (company_id)
);

-- Permissions Table
CREATE TABLE permissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    module_name VARCHAR(50) NOT NULL,
    permission_key VARCHAR(100) NOT NULL,
    permission_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_permission_key (permission_key),
    INDEX idx_permission_module (module_name)
);

-- Role Permissions (Many-to-Many)
CREATE TABLE role_permissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    role_id VARCHAR(36) NOT NULL,
    permission_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id),
    INDEX idx_rp_role (role_id),
    INDEX idx_rp_permission (permission_id)
);

-- Module Licenses Table
CREATE TABLE module_licenses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    module_name VARCHAR(50) NOT NULL,
    license_key VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    valid_from DATE,
    valid_until DATE,
    max_users INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_module (company_id, module_name),
    INDEX idx_ml_company (company_id),
    INDEX idx_ml_active (is_active)
);

-- User Licensed Modules (Many-to-Many)
CREATE TABLE user_licensed_modules (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    module_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_module (user_id, module_name),
    INDEX idx_ulm_user (user_id)
);

-- =====================================================
-- PROJECT MANAGEMENT
-- =====================================================

-- Projects Table
CREATE TABLE projects (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    project_code VARCHAR(50) NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    client_name VARCHAR(200),
    client_contact VARCHAR(100),
    client_email VARCHAR(100),
    client_phone VARCHAR(20),
    project_manager_id VARCHAR(36),
    location VARCHAR(200),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2) DEFAULT 0,
    status ENUM('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled') DEFAULT 'Planning',
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    description TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (project_manager_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_project_code (company_id, project_code),
    INDEX idx_project_company (company_id),
    INDEX idx_project_branch (branch_id),
    INDEX idx_project_status (status),
    INDEX idx_project_manager (project_manager_id)
);

-- Project Orders/Purchase Orders Table
CREATE TABLE project_orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    project_id VARCHAR(36) NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    supplier_name VARCHAR(200),
    supplier_contact VARCHAR(100),
    order_date DATE NOT NULL,
    delivery_date DATE,
    status ENUM('Draft', 'Pending', 'Approved', 'Rejected', 'Received', 'Cancelled') DEFAULT 'Draft',
    subtotal DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    payment_terms VARCHAR(200),
    notes TEXT,
    approved_by VARCHAR(36),
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_order_number (company_id, order_number),
    INDEX idx_po_company (company_id),
    INDEX idx_po_project (project_id),
    INDEX idx_po_status (status)
);

-- Project Order Items Table
CREATE TABLE project_order_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_order_id VARCHAR(36) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    description TEXT,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50),
    unit_price DECIMAL(15, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    discount_rate DECIMAL(5, 2) DEFAULT 0,
    line_total DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_order_id) REFERENCES project_orders(id) ON DELETE CASCADE,
    INDEX idx_poi_order (project_order_id)
);

-- Tasks Table
CREATE TABLE tasks (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    project_id VARCHAR(36),
    task_code VARCHAR(50),
    task_name VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to VARCHAR(36),
    status ENUM('Todo', 'In Progress', 'Review', 'Completed', 'Cancelled') DEFAULT 'Todo',
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMP NULL,
    estimated_hours DECIMAL(10, 2),
    actual_hours DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_task_company (company_id),
    INDEX idx_task_project (project_id),
    INDEX idx_task_assigned (assigned_to),
    INDEX idx_task_status (status)
);

-- =====================================================
-- FLEET MANAGEMENT
-- =====================================================

-- Vehicles Table
CREATE TABLE vehicles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    vehicle_code VARCHAR(50) NOT NULL,
    plate_number VARCHAR(50) NOT NULL,
    vehicle_type ENUM('Car', 'Truck', 'Van', 'Bus', 'Heavy Equipment', 'Other') DEFAULT 'Car',
    make VARCHAR(100),
    model VARCHAR(100),
    year INT,
    color VARCHAR(50),
    vin VARCHAR(100),
    registration_date DATE,
    registration_expiry DATE,
    insurance_expiry DATE,
    fuel_type ENUM('Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG') DEFAULT 'Petrol',
    capacity VARCHAR(50),
    current_mileage DECIMAL(10, 2) DEFAULT 0,
    status ENUM('Available', 'In Use', 'Maintenance', 'Out of Service') DEFAULT 'Available',
    purchase_date DATE,
    purchase_price DECIMAL(15, 2),
    current_driver_id VARCHAR(36),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (current_driver_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_vehicle_code (company_id, vehicle_code),
    UNIQUE KEY unique_plate_number (company_id, plate_number),
    INDEX idx_vehicle_company (company_id),
    INDEX idx_vehicle_status (status)
);

-- Drivers Table
CREATE TABLE drivers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    employee_id VARCHAR(36),
    driver_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    license_type VARCHAR(50),
    license_expiry DATE,
    phone VARCHAR(20),
    email VARCHAR(100),
    status ENUM('Active', 'Inactive', 'On Leave', 'Suspended') DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_driver_code (company_id, driver_code),
    INDEX idx_driver_company (company_id),
    INDEX idx_driver_status (status)
);

-- Fuel Logs Table
CREATE TABLE fuel_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    log_number VARCHAR(50) NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    driver_id VARCHAR(36),
    fuel_date DATE NOT NULL,
    fuel_type ENUM('Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG') DEFAULT 'Petrol',
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(15, 2) NOT NULL,
    odometer_reading DECIMAL(10, 2),
    fuel_station VARCHAR(200),
    receipt_number VARCHAR(100),
    payment_method ENUM('Cash', 'Credit Card', 'Fuel Card', 'Account') DEFAULT 'Cash',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
    UNIQUE KEY unique_log_number (company_id, log_number),
    INDEX idx_fuel_company (company_id),
    INDEX idx_fuel_vehicle (vehicle_id),
    INDEX idx_fuel_date (fuel_date)
);

-- Trip Orders Table
CREATE TABLE trip_orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    trip_number VARCHAR(50) NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    driver_id VARCHAR(36) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    start_location VARCHAR(200),
    end_location VARCHAR(200),
    purpose TEXT,
    start_odometer DECIMAL(10, 2),
    end_odometer DECIMAL(10, 2),
    distance DECIMAL(10, 2),
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_trip_number (company_id, trip_number),
    INDEX idx_trip_company (company_id),
    INDEX idx_trip_vehicle (vehicle_id),
    INDEX idx_trip_status (status)
);

-- =====================================================
-- INVENTORY MANAGEMENT
-- =====================================================

-- Item Categories Table
CREATE TABLE item_categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    category_code VARCHAR(50) NOT NULL,
    category_name VARCHAR(200) NOT NULL,
    parent_category_id VARCHAR(36),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_category_id) REFERENCES item_categories(id) ON DELETE SET NULL,
    UNIQUE KEY unique_category_code (company_id, category_code),
    INDEX idx_category_company (company_id),
    INDEX idx_category_parent (parent_category_id)
);

-- Items/Products Table
CREATE TABLE items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    item_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    category_id VARCHAR(36),
    description TEXT,
    unit_of_measure VARCHAR(50),
    unit_price DECIMAL(15, 2) DEFAULT 0,
    cost_price DECIMAL(15, 2) DEFAULT 0,
    reorder_level DECIMAL(10, 2) DEFAULT 0,
    max_stock_level DECIMAL(10, 2),
    barcode VARCHAR(100),
    sku VARCHAR(100),
    manufacturer VARCHAR(200),
    supplier VARCHAR(200),
    item_type ENUM('Material', 'Tool', 'Equipment', 'Consumable', 'Service', 'Other') DEFAULT 'Material',
    status ENUM('Active', 'Inactive', 'Discontinued') DEFAULT 'Active',
    image_url TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES item_categories(id) ON DELETE SET NULL,
    UNIQUE KEY unique_item_code (company_id, item_code),
    INDEX idx_item_company (company_id),
    INDEX idx_item_category (category_id),
    INDEX idx_item_status (status)
);

-- Stores/Warehouses Table
CREATE TABLE stores (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    store_code VARCHAR(50) NOT NULL,
    store_name VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    manager_id VARCHAR(36),
    capacity VARCHAR(100),
    store_type ENUM('Main', 'Branch', 'Site', 'Mobile', 'Other') DEFAULT 'Branch',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_store_code (company_id, store_code),
    INDEX idx_store_company (company_id),
    INDEX idx_store_branch (branch_id)
);

-- Stock Balance Table (Current Stock Levels)
CREATE TABLE stock_balance (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    store_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 0,
    reserved_quantity DECIMAL(10, 2) DEFAULT 0,
    available_quantity DECIMAL(10, 2) GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_store_item (store_id, item_id),
    INDEX idx_stock_company (company_id),
    INDEX idx_stock_store (store_id),
    INDEX idx_stock_item (item_id)
);

-- Stock Transactions Table (All Inventory Movements)
CREATE TABLE stock_transactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    transaction_number VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_type ENUM('Goods Receiving', 'Store Issue', 'Transfer Out', 'Transfer In', 'Requisition', 'Adjustment', 'Purchase Return', 'Disposal', 'Initial Stock') NOT NULL,
    reference_type VARCHAR(50),
    reference_id VARCHAR(36),
    store_id VARCHAR(36) NOT NULL,
    destination_store_id VARCHAR(36),
    project_id VARCHAR(36),
    supplier_name VARCHAR(200),
    status ENUM('Draft', 'Pending', 'Approved', 'Completed', 'Rejected', 'Cancelled') DEFAULT 'Draft',
    total_value DECIMAL(15, 2) DEFAULT 0,
    notes TEXT,
    approved_by VARCHAR(36),
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_store_id) REFERENCES stores(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_transaction_number (company_id, transaction_number),
    INDEX idx_st_company (company_id),
    INDEX idx_st_type (transaction_type),
    INDEX idx_st_date (transaction_date),
    INDEX idx_st_status (status),
    INDEX idx_st_store (store_id)
);

-- Stock Transaction Items Table
CREATE TABLE stock_transaction_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    transaction_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(15, 2) DEFAULT 0,
    line_total DECIMAL(15, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES stock_transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    INDEX idx_sti_transaction (transaction_id),
    INDEX idx_sti_item (item_id)
);

-- =====================================================
-- PROPERTY MANAGEMENT
-- =====================================================

-- Properties Table
CREATE TABLE properties (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    property_code VARCHAR(50) NOT NULL,
    property_name VARCHAR(200) NOT NULL,
    property_type ENUM('Residential', 'Commercial', 'Industrial', 'Land', 'Other') DEFAULT 'Commercial',
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    total_area DECIMAL(10, 2),
    area_unit VARCHAR(20),
    year_built INT,
    purchase_date DATE,
    purchase_price DECIMAL(15, 2),
    current_value DECIMAL(15, 2),
    status ENUM('Available', 'Occupied', 'Under Maintenance', 'Sold') DEFAULT 'Available',
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    UNIQUE KEY unique_property_code (company_id, property_code),
    INDEX idx_property_company (company_id),
    INDEX idx_property_status (status)
);

-- Property Units Table
CREATE TABLE property_units (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    property_id VARCHAR(36) NOT NULL,
    unit_code VARCHAR(50) NOT NULL,
    unit_name VARCHAR(200) NOT NULL,
    unit_type ENUM('Apartment', 'Office', 'Shop', 'Warehouse', 'Other') DEFAULT 'Office',
    floor_number INT,
    area DECIMAL(10, 2),
    bedrooms INT,
    bathrooms INT,
    monthly_rent DECIMAL(15, 2),
    status ENUM('Vacant', 'Occupied', 'Reserved', 'Under Maintenance') DEFAULT 'Vacant',
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    UNIQUE KEY unique_unit_code (property_id, unit_code),
    INDEX idx_unit_property (property_id),
    INDEX idx_unit_status (status)
);

-- Lease Orders Table
CREATE TABLE lease_orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    lease_number VARCHAR(50) NOT NULL,
    unit_id VARCHAR(36) NOT NULL,
    tenant_name VARCHAR(200) NOT NULL,
    tenant_contact VARCHAR(100),
    tenant_email VARCHAR(100),
    tenant_phone VARCHAR(20),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(15, 2) NOT NULL,
    security_deposit DECIMAL(15, 2),
    payment_due_day INT DEFAULT 1,
    status ENUM('Draft', 'Active', 'Expired', 'Terminated', 'Renewed') DEFAULT 'Draft',
    terms TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (unit_id) REFERENCES property_units(id) ON DELETE CASCADE,
    UNIQUE KEY unique_lease_number (company_id, lease_number),
    INDEX idx_lease_company (company_id),
    INDEX idx_lease_unit (unit_id),
    INDEX idx_lease_status (status)
);

-- =====================================================
-- SERVICE & MAINTENANCE MANAGEMENT
-- =====================================================

-- Service Requests Table
CREATE TABLE service_requests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    request_number VARCHAR(50) NOT NULL,
    request_date DATE NOT NULL,
    requester_name VARCHAR(200),
    requester_contact VARCHAR(100),
    asset_type ENUM('Vehicle', 'Equipment', 'Property', 'Other') DEFAULT 'Equipment',
    asset_id VARCHAR(36),
    issue_description TEXT NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    status ENUM('Submitted', 'Assigned', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Submitted',
    assigned_to VARCHAR(36),
    estimated_cost DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2),
    notes TEXT,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_request_number (company_id, request_number),
    INDEX idx_sr_company (company_id),
    INDEX idx_sr_status (status),
    INDEX idx_sr_priority (priority)
);

-- Work Orders Table
CREATE TABLE work_orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    work_order_number VARCHAR(50) NOT NULL,
    service_request_id VARCHAR(36),
    work_order_date DATE NOT NULL,
    asset_type ENUM('Vehicle', 'Equipment', 'Property', 'Other') DEFAULT 'Equipment',
    asset_id VARCHAR(36),
    work_description TEXT NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    assigned_technician_id VARCHAR(36),
    scheduled_start DATE,
    scheduled_end DATE,
    actual_start TIMESTAMP NULL,
    actual_end TIMESTAMP NULL,
    labor_cost DECIMAL(15, 2) DEFAULT 0,
    parts_cost DECIMAL(15, 2) DEFAULT 0,
    total_cost DECIMAL(15, 2) DEFAULT 0,
    notes TEXT,
    completion_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_technician_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_wo_number (company_id, work_order_number),
    INDEX idx_wo_company (company_id),
    INDEX idx_wo_status (status),
    INDEX idx_wo_technician (assigned_technician_id)
);

-- Preventive Maintenance Schedules Table
CREATE TABLE preventive_maintenance (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    schedule_code VARCHAR(50) NOT NULL,
    schedule_name VARCHAR(200) NOT NULL,
    asset_type ENUM('Vehicle', 'Equipment', 'Property', 'Other') DEFAULT 'Equipment',
    asset_id VARCHAR(36),
    maintenance_type VARCHAR(100),
    frequency ENUM('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual') DEFAULT 'Monthly',
    frequency_value INT DEFAULT 1,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    assigned_technician_id VARCHAR(36),
    estimated_cost DECIMAL(15, 2),
    checklist TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_technician_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_schedule_code (company_id, schedule_code),
    INDEX idx_pm_company (company_id),
    INDEX idx_pm_next_date (next_maintenance_date)
);

-- =====================================================
-- HR MANAGEMENT
-- =====================================================

-- Employees Table
CREATE TABLE employees (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    user_id VARCHAR(36),
    employee_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (CONCAT(first_name, ' ', last_name)) STORED,
    email VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other'),
    national_id VARCHAR(50),
    passport_number VARCHAR(50),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    department VARCHAR(100),
    position VARCHAR(100),
    employment_type ENUM('Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Intern') DEFAULT 'Full-Time',
    join_date DATE NOT NULL,
    termination_date DATE,
    basic_salary DECIMAL(15, 2),
    bank_name VARCHAR(100),
    bank_account VARCHAR(100),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    status ENUM('Active', 'Inactive', 'On Leave', 'Terminated') DEFAULT 'Active',
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_employee_code (company_id, employee_code),
    INDEX idx_employee_company (company_id),
    INDEX idx_employee_branch (branch_id),
    INDEX idx_employee_status (status)
);

-- Attendance Records Table
CREATE TABLE attendance (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    employee_id VARCHAR(36) NOT NULL,
    attendance_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    work_hours DECIMAL(5, 2),
    overtime_hours DECIMAL(5, 2) DEFAULT 0,
    status ENUM('Present', 'Absent', 'Late', 'Half Day', 'On Leave', 'Holiday') DEFAULT 'Present',
    notes TEXT,
    device_id VARCHAR(50),
    check_in_location VARCHAR(200),
    check_out_location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_employee_date (employee_id, attendance_date),
    INDEX idx_attendance_company (company_id),
    INDEX idx_attendance_employee (employee_id),
    INDEX idx_attendance_date (attendance_date),
    INDEX idx_attendance_status (status)
);

-- Leave Management Table
CREATE TABLE leave_requests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    employee_id VARCHAR(36) NOT NULL,
    leave_number VARCHAR(50) NOT NULL,
    leave_type ENUM('Annual', 'Sick', 'Emergency', 'Unpaid', 'Maternity', 'Paternity', 'Other') DEFAULT 'Annual',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(5, 2) NOT NULL,
    reason TEXT,
    status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
    approved_by VARCHAR(36),
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_leave_number (company_id, leave_number),
    INDEX idx_leave_company (company_id),
    INDEX idx_leave_employee (employee_id),
    INDEX idx_leave_status (status)
);

-- Payroll Table
CREATE TABLE payroll (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    payroll_number VARCHAR(50) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    payroll_period_start DATE NOT NULL,
    payroll_period_end DATE NOT NULL,
    payment_date DATE,
    basic_salary DECIMAL(15, 2) NOT NULL,
    allowances DECIMAL(15, 2) DEFAULT 0,
    overtime_pay DECIMAL(15, 2) DEFAULT 0,
    bonuses DECIMAL(15, 2) DEFAULT 0,
    gross_salary DECIMAL(15, 2) NOT NULL,
    tax_deduction DECIMAL(15, 2) DEFAULT 0,
    insurance_deduction DECIMAL(15, 2) DEFAULT 0,
    other_deductions DECIMAL(15, 2) DEFAULT 0,
    total_deductions DECIMAL(15, 2) DEFAULT 0,
    net_salary DECIMAL(15, 2) NOT NULL,
    payment_method ENUM('Cash', 'Bank Transfer', 'Cheque') DEFAULT 'Bank Transfer',
    payment_reference VARCHAR(100),
    status ENUM('Draft', 'Pending', 'Approved', 'Paid', 'Cancelled') DEFAULT 'Draft',
    notes TEXT,
    approved_by VARCHAR(36),
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_payroll_number (company_id, payroll_number),
    INDEX idx_payroll_company (company_id),
    INDEX idx_payroll_employee (employee_id),
    INDEX idx_payroll_period (payroll_period_start, payroll_period_end),
    INDEX idx_payroll_status (status)
);

-- =====================================================
-- FINANCE MANAGEMENT
-- =====================================================

-- Invoices Table
CREATE TABLE invoices (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    invoice_number VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    customer_name VARCHAR(200) NOT NULL,
    customer_contact VARCHAR(100),
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    project_id VARCHAR(36),
    invoice_type ENUM('Sales', 'Service', 'Rent', 'Other') DEFAULT 'Sales',
    subtotal DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) DEFAULT 0,
    balance DECIMAL(15, 2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    status ENUM('Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled') DEFAULT 'Draft',
    payment_terms VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    UNIQUE KEY unique_invoice_number (company_id, invoice_number),
    INDEX idx_invoice_company (company_id),
    INDEX idx_invoice_date (invoice_date),
    INDEX idx_invoice_status (status),
    INDEX idx_invoice_customer (customer_name)
);

-- Invoice Items Table
CREATE TABLE invoice_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    invoice_id VARCHAR(36) NOT NULL,
    description VARCHAR(200) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50),
    unit_price DECIMAL(15, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    discount_rate DECIMAL(5, 2) DEFAULT 0,
    line_total DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    INDEX idx_ii_invoice (invoice_id)
);

-- Expenses Table
CREATE TABLE expenses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    expense_number VARCHAR(50) NOT NULL,
    expense_date DATE NOT NULL,
    expense_category ENUM('Office Supplies', 'Travel', 'Utilities', 'Maintenance', 'Salaries', 'Marketing', 'Other') DEFAULT 'Other',
    vendor_name VARCHAR(200),
    project_id VARCHAR(36),
    employee_id VARCHAR(36),
    amount DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    payment_method ENUM('Cash', 'Credit Card', 'Bank Transfer', 'Cheque') DEFAULT 'Cash',
    payment_reference VARCHAR(100),
    description TEXT,
    status ENUM('Draft', 'Pending', 'Approved', 'Paid', 'Rejected') DEFAULT 'Draft',
    approved_by VARCHAR(36),
    approved_at TIMESTAMP NULL,
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_expense_number (company_id, expense_number),
    INDEX idx_expense_company (company_id),
    INDEX idx_expense_date (expense_date),
    INDEX idx_expense_status (status),
    INDEX idx_expense_category (expense_category)
);

-- Payment Vouchers Table
CREATE TABLE payment_vouchers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    voucher_number VARCHAR(50) NOT NULL,
    voucher_date DATE NOT NULL,
    payment_type ENUM('Supplier Payment', 'Employee Payment', 'Expense Payment', 'Other') DEFAULT 'Supplier Payment',
    payee_name VARCHAR(200) NOT NULL,
    payee_account VARCHAR(100),
    reference_type VARCHAR(50),
    reference_id VARCHAR(36),
    amount DECIMAL(15, 2) NOT NULL,
    payment_method ENUM('Cash', 'Bank Transfer', 'Cheque', 'Credit Card') DEFAULT 'Bank Transfer',
    cheque_number VARCHAR(50),
    bank_name VARCHAR(100),
    transaction_reference VARCHAR(100),
    description TEXT,
    status ENUM('Draft', 'Pending', 'Approved', 'Paid', 'Cancelled') DEFAULT 'Draft',
    approved_by VARCHAR(36),
    approved_at TIMESTAMP NULL,
    paid_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_voucher_number (company_id, voucher_number),
    INDEX idx_pv_company (company_id),
    INDEX idx_pv_date (voucher_date),
    INDEX idx_pv_status (status),
    INDEX idx_pv_payee (payee_name)
);

-- =====================================================
-- DOCUMENT NUMBERING & WORKFLOWS
-- =====================================================

-- Document Numbering Table
CREATE TABLE document_numbering (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    prefix VARCHAR(20),
    next_number INT NOT NULL DEFAULT 1,
    suffix VARCHAR(20),
    number_length INT DEFAULT 5,
    format_pattern VARCHAR(100),
    example VARCHAR(50),
    reset_frequency ENUM('Never', 'Daily', 'Monthly', 'Yearly') DEFAULT 'Yearly',
    last_reset_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_doc_type (company_id, document_type),
    INDEX idx_dn_company (company_id)
);

-- Approval Workflows Table
CREATE TABLE approval_workflows (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    workflow_name VARCHAR(200) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_aw_company (company_id),
    INDEX idx_aw_doc_type (document_type)
);

-- Approval Workflow Steps Table
CREATE TABLE approval_workflow_steps (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    workflow_id VARCHAR(36) NOT NULL,
    step_order INT NOT NULL,
    step_name VARCHAR(200) NOT NULL,
    approver_role_id VARCHAR(36),
    approver_user_id VARCHAR(36),
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES approval_workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (approver_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_aws_workflow (workflow_id),
    INDEX idx_aws_order (step_order)
);

-- Approval Requests Table
CREATE TABLE approval_requests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    workflow_id VARCHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_id VARCHAR(36) NOT NULL,
    current_step INT DEFAULT 1,
    status ENUM('Pending', 'In Progress', 'Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
    requested_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (workflow_id) REFERENCES approval_workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ar_company (company_id),
    INDEX idx_ar_workflow (workflow_id),
    INDEX idx_ar_status (status),
    INDEX idx_ar_document (document_type, document_id)
);

-- Approval History Table
CREATE TABLE approval_history (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    approval_request_id VARCHAR(36) NOT NULL,
    step_order INT NOT NULL,
    step_name VARCHAR(200) NOT NULL,
    approver_id VARCHAR(36) NOT NULL,
    action ENUM('Approved', 'Rejected', 'Returned') NOT NULL,
    comments TEXT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (approval_request_id) REFERENCES approval_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ah_request (approval_request_id),
    INDEX idx_ah_approver (approver_id)
);

-- =====================================================
-- COMMON TABLES
-- =====================================================

-- Attachments Table
CREATE TABLE attachments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    file_url TEXT NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_attachment_entity (entity_type, entity_id),
    INDEX idx_attachment_company (company_id)
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    entity_description VARCHAR(200),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_company (company_id),
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_created (created_at)
);

-- Notifications Table
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('Info', 'Success', 'Warning', 'Error') DEFAULT 'Info',
    entity_type VARCHAR(50),
    entity_id VARCHAR(36),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notification_user (user_id),
    INDEX idx_notification_read (is_read),
    INDEX idx_notification_created (created_at)
);

-- Comments Table
CREATE TABLE comments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    comment_text TEXT NOT NULL,
    parent_comment_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_comment_entity (entity_type, entity_id),
    INDEX idx_comment_user (user_id),
    INDEX idx_comment_created (created_at)
);

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert Default Permissions
INSERT INTO permissions (module_name, permission_key, permission_name, description) VALUES
('dashboard', 'dashboard.view', 'View Dashboard', 'View dashboard and analytics'),
('users', 'users.view', 'View Users', 'View user list'),
('users', 'users.create', 'Create Users', 'Create new users'),
('users', 'users.edit', 'Edit Users', 'Edit existing users'),
('users', 'users.delete', 'Delete Users', 'Delete users'),
('roles', 'roles.view', 'View Roles', 'View roles list'),
('roles', 'roles.create', 'Create Roles', 'Create new roles'),
('roles', 'roles.edit', 'Edit Roles', 'Edit existing roles'),
('roles', 'roles.delete', 'Delete Roles', 'Delete roles'),
('projects', 'projects.view', 'View Projects', 'View project list'),
('projects', 'projects.create', 'Create Projects', 'Create new projects'),
('projects', 'projects.edit', 'Edit Projects', 'Edit existing projects'),
('projects', 'projects.delete', 'Delete Projects', 'Delete projects'),
('fleet', 'fleet.view', 'View Fleet', 'View fleet information'),
('vehicles', 'vehicles.view', 'View Vehicles', 'View vehicle list'),
('vehicles', 'vehicles.create', 'Create Vehicles', 'Add new vehicles'),
('vehicles', 'vehicles.edit', 'Edit Vehicles', 'Edit vehicle details'),
('vehicles', 'vehicles.delete', 'Delete Vehicles', 'Delete vehicles'),
('inventory', 'inventory.view', 'View Inventory', 'View inventory information'),
('items', 'items.view', 'View Items', 'View item list'),
('items', 'items.create', 'Create Items', 'Add new items'),
('items', 'items.edit', 'Edit Items', 'Edit item details'),
('items', 'items.delete', 'Delete Items', 'Delete items'),
('hr', 'hr.view', 'View HR', 'View HR information'),
('employees', 'employees.view', 'View Employees', 'View employee list'),
('employees', 'employees.create', 'Create Employees', 'Add new employees'),
('employees', 'employees.edit', 'Edit Employees', 'Edit employee details'),
('employees', 'employees.delete', 'Delete Employees', 'Delete employees'),
('finance', 'finance.view', 'View Finance', 'View financial information'),
('invoices', 'invoices.view', 'View Invoices', 'View invoice list'),
('invoices', 'invoices.create', 'Create Invoices', 'Create new invoices'),
('invoices', 'invoices.edit', 'Edit Invoices', 'Edit invoices'),
('invoices', 'invoices.delete', 'Delete Invoices', 'Delete invoices'),
('settings', 'settings.view', 'View Settings', 'View system settings'),
('settings', 'settings.edit', 'Edit Settings', 'Modify system settings');

-- =====================================================
-- END OF SCHEMA
-- =====================================================
