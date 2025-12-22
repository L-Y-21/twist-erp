-- =====================================================
-- TWIST ERP - COMPLETE PostgreSQL Database Schema
-- Construction Company Management System
-- All Tables in One File
-- =====================================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- SYSTEM CONFIGURATION TABLES
-- =====================================================

-- Companies/Organizations
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_company_code ON companies(company_code);
CREATE INDEX idx_company_active ON companies(is_active);

-- Branches
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_code VARCHAR(20) NOT NULL,
    branch_name VARCHAR(200) NOT NULL,
    manager_id UUID,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, branch_code)
);

CREATE INDEX idx_branch_company ON branches(company_id);
CREATE INDEX idx_branch_active ON branches(is_active);

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    department_code VARCHAR(50) NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    manager_id UUID,
    parent_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, department_code)
);

CREATE INDEX idx_dept_company ON departments(company_id);
CREATE INDEX idx_dept_branch ON departments(branch_id);

-- =====================================================
-- MODULE LICENSING & PERMISSIONS SYSTEM
-- =====================================================

-- System Modules
CREATE TABLE system_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_code VARCHAR(50) UNIQUE NOT NULL,
    module_name VARCHAR(200) NOT NULL,
    module_category VARCHAR(100),
    parent_module_id UUID REFERENCES system_modules(id) ON DELETE CASCADE,
    description TEXT,
    icon_name VARCHAR(50),
    route_path VARCHAR(200),
    display_order INTEGER DEFAULT 0,
    is_core_module BOOLEAN DEFAULT FALSE,
    requires_license BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_module_code ON system_modules(module_code);
CREATE INDEX idx_module_category ON system_modules(module_category);
CREATE INDEX idx_module_parent ON system_modules(parent_module_id);

-- Module Licenses
CREATE TABLE module_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES system_modules(id) ON DELETE CASCADE,
    license_key VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    valid_from DATE,
    valid_until DATE,
    max_users INTEGER,
    current_users INTEGER DEFAULT 0,
    features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, module_id)
);

CREATE INDEX idx_ml_company ON module_licenses(company_id);
CREATE INDEX idx_ml_module ON module_licenses(module_id);
CREATE INDEX idx_ml_active ON module_licenses(is_active);

-- Permissions
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES system_modules(id) ON DELETE CASCADE,
    permission_code VARCHAR(100) UNIQUE NOT NULL,
    permission_name VARCHAR(100) NOT NULL,
    permission_type VARCHAR(20) DEFAULT 'action',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_permission_module ON permissions(module_id);
CREATE INDEX idx_permission_code ON permissions(permission_code);

-- =====================================================
-- USER MANAGEMENT & SECURITY
-- =====================================================

-- Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, role_name)
);

CREATE INDEX idx_role_company ON roles(company_id);

-- Role Permissions
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    UNIQUE (role_id, permission_id)
);

CREATE INDEX idx_rp_role ON role_permissions(role_id);
CREATE INDEX idx_rp_permission ON role_permissions(permission_id);

-- Role Module Access
CREATE TABLE role_module_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES system_modules(id) ON DELETE CASCADE,
    can_view BOOLEAN DEFAULT TRUE,
    can_create BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_approve BOOLEAN DEFAULT FALSE,
    can_export BOOLEAN DEFAULT FALSE,
    custom_permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    UNIQUE (role_id, module_id)
);

CREATE INDEX idx_rma_role ON role_module_access(role_id);
CREATE INDEX idx_rma_module ON role_module_access(module_id);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    phone VARCHAR(20),
    avatar_url TEXT,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    employee_id UUID,
    is_system_user BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    password_changed_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_user_company ON users(company_id);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role_id);

-- User Module Access
CREATE TABLE user_module_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES system_modules(id) ON DELETE CASCADE,
    is_granted BOOLEAN DEFAULT TRUE,
    can_view BOOLEAN,
    can_create BOOLEAN,
    can_edit BOOLEAN,
    can_delete BOOLEAN,
    can_approve BOOLEAN,
    can_export BOOLEAN,
    custom_permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    UNIQUE (user_id, module_id)
);

CREATE INDEX idx_uma_user ON user_module_access(user_id);

-- =====================================================
-- PROJECT MANAGEMENT
-- =====================================================

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    project_code VARCHAR(50) NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    client_name VARCHAR(200),
    client_contact VARCHAR(100),
    client_email VARCHAR(100),
    client_phone VARCHAR(20),
    project_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    location VARCHAR(200),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Planning' CHECK (status IN ('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled')),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    description TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, project_code)
);

CREATE INDEX idx_project_company ON projects(company_id);
CREATE INDEX idx_project_status ON projects(status);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    task_code VARCHAR(50),
    task_name VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'Todo' CHECK (status IN ('Todo', 'In Progress', 'Review', 'Completed', 'Cancelled')),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMP,
    estimated_hours DECIMAL(10, 2),
    actual_hours DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_task_company ON tasks(company_id);
CREATE INDEX idx_task_project ON tasks(project_id);
CREATE INDEX idx_task_assigned ON tasks(assigned_to);

-- Project Orders
CREATE TABLE project_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    order_number VARCHAR(50) NOT NULL,
    supplier_name VARCHAR(200),
    supplier_contact VARCHAR(100),
    order_date DATE NOT NULL,
    delivery_date DATE,
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Approved', 'Rejected', 'Received', 'Cancelled')),
    subtotal DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    payment_terms VARCHAR(200),
    notes TEXT,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, order_number)
);

CREATE INDEX idx_po_company ON project_orders(company_id);
CREATE INDEX idx_po_project ON project_orders(project_id);

-- Project Order Items
CREATE TABLE project_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_order_id UUID NOT NULL REFERENCES project_orders(id) ON DELETE CASCADE,
    item_name VARCHAR(200) NOT NULL,
    description TEXT,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50),
    unit_price DECIMAL(15, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    discount_rate DECIMAL(5, 2) DEFAULT 0,
    line_total DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_poi_order ON project_order_items(project_order_id);

-- =====================================================
-- FLEET MANAGEMENT
-- =====================================================

-- Vehicles
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    vehicle_code VARCHAR(50) NOT NULL,
    plate_number VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(20) DEFAULT 'Car' CHECK (vehicle_type IN ('Car', 'Truck', 'Van', 'Bus', 'Heavy Equipment', 'Other')),
    make VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    color VARCHAR(50),
    vin VARCHAR(100),
    registration_date DATE,
    registration_expiry DATE,
    insurance_expiry DATE,
    fuel_type VARCHAR(20) DEFAULT 'Petrol' CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG')),
    capacity VARCHAR(50),
    current_mileage DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'In Use', 'Maintenance', 'Out of Service')),
    purchase_date DATE,
    purchase_price DECIMAL(15, 2),
    current_driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, vehicle_code),
    UNIQUE (company_id, plate_number)
);

CREATE INDEX idx_vehicle_company ON vehicles(company_id);
CREATE INDEX idx_vehicle_status ON vehicles(status);

-- Drivers
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    driver_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    license_type VARCHAR(50),
    license_expiry DATE,
    phone VARCHAR(20),
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave', 'Suspended')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, driver_code)
);

CREATE INDEX idx_driver_company ON drivers(company_id);
CREATE INDEX idx_driver_status ON drivers(status);

-- Fuel Logs
CREATE TABLE fuel_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    log_number VARCHAR(50) NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    fuel_date DATE NOT NULL,
    fuel_type VARCHAR(20) DEFAULT 'Petrol' CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG')),
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(15, 2) NOT NULL,
    odometer_reading DECIMAL(10, 2),
    fuel_station VARCHAR(200),
    receipt_number VARCHAR(100),
    payment_method VARCHAR(20) DEFAULT 'Cash' CHECK (payment_method IN ('Cash', 'Credit Card', 'Fuel Card', 'Account')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, log_number)
);

CREATE INDEX idx_fuel_company ON fuel_logs(company_id);
CREATE INDEX idx_fuel_vehicle ON fuel_logs(vehicle_id);
CREATE INDEX idx_fuel_date ON fuel_logs(fuel_date);

-- Trip Orders
CREATE TABLE trip_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    trip_number VARCHAR(50) NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    start_location VARCHAR(200),
    end_location VARCHAR(200),
    purpose TEXT,
    start_odometer DECIMAL(10, 2),
    end_odometer DECIMAL(10, 2),
    distance DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, trip_number)
);

CREATE INDEX idx_trip_company ON trip_orders(company_id);
CREATE INDEX idx_trip_vehicle ON trip_orders(vehicle_id);
CREATE INDEX idx_trip_status ON trip_orders(status);

-- =====================================================
-- INVENTORY MANAGEMENT
-- =====================================================

-- Item Categories
CREATE TABLE item_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    category_code VARCHAR(50) NOT NULL,
    category_name VARCHAR(200) NOT NULL,
    parent_category_id UUID REFERENCES item_categories(id) ON DELETE SET NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, category_code)
);

CREATE INDEX idx_category_company ON item_categories(company_id);
CREATE INDEX idx_category_parent ON item_categories(parent_category_id);

-- Items
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    item_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    category_id UUID REFERENCES item_categories(id) ON DELETE SET NULL,
    description TEXT,
    unit_of_measure VARCHAR(50),
    unit_price DECIMAL(15, 2) DEFAULT 0,
    cost_price DECIMAL(15, 2) DEFAULT 0,
    reorder_level DECIMAL(10, 2) DEFAULT 0,
    max_stock_level DECIMAL(10, 2),
    warehouse_location VARCHAR(100),
    barcode VARCHAR(100),
    sku VARCHAR(100),
    manufacturer VARCHAR(200),
    supplier VARCHAR(200),
    item_type VARCHAR(20) DEFAULT 'Material' CHECK (item_type IN ('Material', 'Tool', 'Equipment', 'Consumable', 'Service', 'Other')),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Discontinued')),
    image_url TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, item_code)
);

CREATE INDEX idx_item_company ON items(company_id);
CREATE INDEX idx_item_category ON items(category_id);
CREATE INDEX idx_item_status ON items(status);

-- Stores/Warehouses
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    store_code VARCHAR(50) NOT NULL,
    store_name VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    capacity VARCHAR(100),
    store_type VARCHAR(20) DEFAULT 'Branch' CHECK (store_type IN ('Main', 'Branch', 'Site', 'Mobile', 'Other')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, store_code)
);

CREATE INDEX idx_store_company ON stores(company_id);
CREATE INDEX idx_store_branch ON stores(branch_id);

-- Stock Balance
CREATE TABLE stock_balance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) DEFAULT 0,
    reserved_quantity DECIMAL(10, 2) DEFAULT 0,
    available_quantity DECIMAL(10, 2) GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (store_id, item_id)
);

CREATE INDEX idx_stock_company ON stock_balance(company_id);
CREATE INDEX idx_stock_store ON stock_balance(store_id);
CREATE INDEX idx_stock_item ON stock_balance(item_id);

-- Stock Transactions
CREATE TABLE stock_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    transaction_number VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('Goods Receiving', 'Store Issue', 'Transfer Out', 'Transfer In', 'Requisition', 'Adjustment', 'Purchase Return', 'Disposal', 'Initial Stock')),
    reference_type VARCHAR(50),
    reference_id UUID,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    destination_store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    supplier_name VARCHAR(200),
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Approved', 'Completed', 'Rejected', 'Cancelled')),
    total_value DECIMAL(15, 2) DEFAULT 0,
    notes TEXT,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, transaction_number)
);

CREATE INDEX idx_st_company ON stock_transactions(company_id);
CREATE INDEX idx_st_type ON stock_transactions(transaction_type);
CREATE INDEX idx_st_date ON stock_transactions(transaction_date);
CREATE INDEX idx_st_status ON stock_transactions(status);
CREATE INDEX idx_st_store ON stock_transactions(store_id);

-- Stock Transaction Items
CREATE TABLE stock_transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES stock_transactions(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(15, 2) DEFAULT 0,
    line_total DECIMAL(15, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sti_transaction ON stock_transaction_items(transaction_id);
CREATE INDEX idx_sti_item ON stock_transaction_items(item_id);

-- =====================================================
-- PROPERTY MANAGEMENT
-- =====================================================

-- Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    property_code VARCHAR(50) NOT NULL,
    property_name VARCHAR(200) NOT NULL,
    property_type VARCHAR(20) DEFAULT 'Commercial' CHECK (property_type IN ('Residential', 'Commercial', 'Industrial', 'Land', 'Other')),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    total_area DECIMAL(10, 2),
    area_unit VARCHAR(20),
    year_built INTEGER,
    purchase_date DATE,
    purchase_price DECIMAL(15, 2),
    current_value DECIMAL(15, 2),
    status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Under Maintenance', 'Sold')),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, property_code)
);

CREATE INDEX idx_property_company ON properties(company_id);
CREATE INDEX idx_property_status ON properties(status);

-- Property Units
CREATE TABLE property_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    unit_code VARCHAR(50) NOT NULL,
    unit_name VARCHAR(200) NOT NULL,
    unit_type VARCHAR(20) DEFAULT 'Office' CHECK (unit_type IN ('Apartment', 'Office', 'Shop', 'Warehouse', 'Other')),
    floor_number INTEGER,
    area DECIMAL(10, 2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    monthly_rent DECIMAL(15, 2),
    status VARCHAR(20) DEFAULT 'Vacant' CHECK (status IN ('Vacant', 'Occupied', 'Reserved', 'Under Maintenance')),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (property_id, unit_code)
);

CREATE INDEX idx_unit_property ON property_units(property_id);
CREATE INDEX idx_unit_status ON property_units(status);

-- Lease Orders
CREATE TABLE lease_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    lease_number VARCHAR(50) NOT NULL,
    unit_id UUID NOT NULL REFERENCES property_units(id) ON DELETE CASCADE,
    tenant_name VARCHAR(200) NOT NULL,
    tenant_contact VARCHAR(100),
    tenant_email VARCHAR(100),
    tenant_phone VARCHAR(20),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(15, 2) NOT NULL,
    security_deposit DECIMAL(15, 2),
    payment_due_day INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Active', 'Expired', 'Terminated', 'Renewed')),
    terms TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, lease_number)
);

CREATE INDEX idx_lease_company ON lease_orders(company_id);
CREATE INDEX idx_lease_unit ON lease_orders(unit_id);
CREATE INDEX idx_lease_status ON lease_orders(status);

-- =====================================================
-- SERVICE & MAINTENANCE
-- =====================================================

-- Service Requests
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    request_number VARCHAR(50) NOT NULL,
    request_date DATE NOT NULL,
    requester_name VARCHAR(200),
    requester_contact VARCHAR(100),
    asset_type VARCHAR(20) DEFAULT 'Equipment' CHECK (asset_type IN ('Vehicle', 'Equipment', 'Property', 'Other')),
    asset_id UUID,
    issue_description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(20) DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Assigned', 'In Progress', 'Completed', 'Cancelled')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    estimated_cost DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2),
    notes TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, request_number)
);

CREATE INDEX idx_sr_company ON service_requests(company_id);
CREATE INDEX idx_sr_status ON service_requests(status);
CREATE INDEX idx_sr_priority ON service_requests(priority);

-- Work Orders
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    work_order_number VARCHAR(50) NOT NULL,
    service_request_id UUID REFERENCES service_requests(id) ON DELETE SET NULL,
    work_order_date DATE NOT NULL,
    asset_type VARCHAR(20) DEFAULT 'Equipment' CHECK (asset_type IN ('Vehicle', 'Equipment', 'Property', 'Other')),
    asset_id UUID,
    work_description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(20) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
    assigned_technician_id UUID REFERENCES users(id) ON DELETE SET NULL,
    scheduled_start DATE,
    scheduled_end DATE,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    labor_cost DECIMAL(15, 2) DEFAULT 0,
    parts_cost DECIMAL(15, 2) DEFAULT 0,
    total_cost DECIMAL(15, 2) DEFAULT 0,
    notes TEXT,
    completion_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, work_order_number)
);

CREATE INDEX idx_wo_company ON work_orders(company_id);
CREATE INDEX idx_wo_status ON work_orders(status);
CREATE INDEX idx_wo_technician ON work_orders(assigned_technician_id);

-- Preventive Maintenance
CREATE TABLE preventive_maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    schedule_code VARCHAR(50) NOT NULL,
    schedule_name VARCHAR(200) NOT NULL,
    asset_type VARCHAR(20) DEFAULT 'Equipment' CHECK (asset_type IN ('Vehicle', 'Equipment', 'Property', 'Other')),
    asset_id UUID,
    maintenance_type VARCHAR(100),
    frequency VARCHAR(20) DEFAULT 'Monthly' CHECK (frequency IN ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual')),
    frequency_value INTEGER DEFAULT 1,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    assigned_technician_id UUID REFERENCES users(id) ON DELETE SET NULL,
    estimated_cost DECIMAL(15, 2),
    checklist TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, schedule_code)
);

CREATE INDEX idx_pm_company ON preventive_maintenance(company_id);
CREATE INDEX idx_pm_next_date ON preventive_maintenance(next_maintenance_date);

-- =====================================================
-- HR MANAGEMENT
-- =====================================================

-- Employees
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    employee_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    email VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    national_id VARCHAR(50),
    passport_number VARCHAR(50),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    position VARCHAR(100),
    employment_type VARCHAR(20) DEFAULT 'Full-Time' CHECK (employment_type IN ('Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Intern')),
    join_date DATE NOT NULL,
    termination_date DATE,
    basic_salary DECIMAL(15, 2),
    bank_name VARCHAR(100),
    bank_account VARCHAR(100),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave', 'Terminated')),
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, employee_code)
);

CREATE INDEX idx_employee_company ON employees(company_id);
CREATE INDEX idx_employee_branch ON employees(branch_id);
CREATE INDEX idx_employee_status ON employees(status);

-- Attendance
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    work_hours DECIMAL(5, 2),
    overtime_hours DECIMAL(5, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Late', 'Half Day', 'On Leave', 'Holiday')),
    notes TEXT,
    device_id VARCHAR(50),
    check_in_location VARCHAR(200),
    check_out_location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (employee_id, attendance_date)
);

CREATE INDEX idx_attendance_company ON attendance(company_id);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);

-- Leave Requests
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_number VARCHAR(50) NOT NULL,
    leave_type VARCHAR(20) DEFAULT 'Annual' CHECK (leave_type IN ('Annual', 'Sick', 'Emergency', 'Unpaid', 'Maternity', 'Paternity', 'Other')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(5, 2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, leave_number)
);

CREATE INDEX idx_leave_company ON leave_requests(company_id);
CREATE INDEX idx_leave_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_status ON leave_requests(status);

-- Payroll
CREATE TABLE payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    payroll_number VARCHAR(50) NOT NULL,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
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
    payment_method VARCHAR(20) DEFAULT 'Bank Transfer' CHECK (payment_method IN ('Cash', 'Bank Transfer', 'Cheque')),
    payment_reference VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Approved', 'Paid', 'Cancelled')),
    notes TEXT,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, payroll_number)
);

CREATE INDEX idx_payroll_company ON payroll(company_id);
CREATE INDEX idx_payroll_employee ON payroll(employee_id);
CREATE INDEX idx_payroll_period ON payroll(payroll_period_start, payroll_period_end);

-- =====================================================
-- FINANCE MANAGEMENT
-- =====================================================

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    customer_name VARCHAR(200) NOT NULL,
    customer_contact VARCHAR(100),
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    invoice_type VARCHAR(20) DEFAULT 'Sales' CHECK (invoice_type IN ('Sales', 'Service', 'Rent', 'Other')),
    subtotal DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) DEFAULT 0,
    balance DECIMAL(15, 2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled')),
    payment_terms VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, invoice_number)
);

CREATE INDEX idx_invoice_company ON invoices(company_id);
CREATE INDEX idx_invoice_date ON invoices(invoice_date);
CREATE INDEX idx_invoice_status ON invoices(status);

-- Invoice Items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(200) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50),
    unit_price DECIMAL(15, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    discount_rate DECIMAL(5, 2) DEFAULT 0,
    line_total DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ii_invoice ON invoice_items(invoice_id);

-- Expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    expense_number VARCHAR(50) NOT NULL,
    expense_date DATE NOT NULL,
    expense_category VARCHAR(30) DEFAULT 'Other' CHECK (expense_category IN ('Office Supplies', 'Travel', 'Utilities', 'Maintenance', 'Salaries', 'Marketing', 'Other')),
    vendor_name VARCHAR(200),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    amount DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'Cash' CHECK (payment_method IN ('Cash', 'Credit Card', 'Bank Transfer', 'Cheque')),
    payment_reference VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Approved', 'Paid', 'Rejected')),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, expense_number)
);

CREATE INDEX idx_expense_company ON expenses(company_id);
CREATE INDEX idx_expense_date ON expenses(expense_date);
CREATE INDEX idx_expense_status ON expenses(status);

-- Payment Vouchers
CREATE TABLE payment_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    voucher_number VARCHAR(50) NOT NULL,
    voucher_date DATE NOT NULL,
    payment_type VARCHAR(30) DEFAULT 'Supplier Payment' CHECK (payment_type IN ('Supplier Payment', 'Employee Payment', 'Expense Payment', 'Other')),
    payee_name VARCHAR(200) NOT NULL,
    payee_account VARCHAR(100),
    reference_type VARCHAR(50),
    reference_id UUID,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'Bank Transfer' CHECK (payment_method IN ('Cash', 'Bank Transfer', 'Cheque', 'Credit Card')),
    cheque_number VARCHAR(50),
    bank_name VARCHAR(100),
    transaction_reference VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Approved', 'Paid', 'Cancelled')),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    paid_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    UNIQUE (company_id, voucher_number)
);

CREATE INDEX idx_pv_company ON payment_vouchers(company_id);
CREATE INDEX idx_pv_date ON payment_vouchers(voucher_date);
CREATE INDEX idx_pv_status ON payment_vouchers(status);

-- =====================================================
-- DOCUMENT NUMBERING & WORKFLOWS
-- =====================================================

-- Document Numbering
CREATE TABLE document_numbering (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    prefix VARCHAR(20),
    next_number INTEGER NOT NULL DEFAULT 1,
    suffix VARCHAR(20),
    number_length INTEGER DEFAULT 5,
    format_pattern VARCHAR(100),
    example VARCHAR(50),
    reset_frequency VARCHAR(20) DEFAULT 'Yearly' CHECK (reset_frequency IN ('Never', 'Daily', 'Monthly', 'Yearly')),
    last_reset_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (company_id, document_type)
);

CREATE INDEX idx_dn_company ON document_numbering(company_id);

-- Approval Workflows
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    workflow_name VARCHAR(200) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_aw_company ON approval_workflows(company_id);
CREATE INDEX idx_aw_doc_type ON approval_workflows(document_type);

-- Approval Workflow Steps
CREATE TABLE approval_workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES approval_workflows(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    step_name VARCHAR(200) NOT NULL,
    approver_role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    approver_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_aws_workflow ON approval_workflow_steps(workflow_id);
CREATE INDEX idx_aws_order ON approval_workflow_steps(step_order);

-- Approval Requests
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    workflow_id UUID NOT NULL REFERENCES approval_workflows(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_id UUID NOT NULL,
    current_step INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Approved', 'Rejected', 'Cancelled')),
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ar_company ON approval_requests(company_id);
CREATE INDEX idx_ar_workflow ON approval_requests(workflow_id);
CREATE INDEX idx_ar_status ON approval_requests(status);
CREATE INDEX idx_ar_document ON approval_requests(document_type, document_id);

-- Approval History
CREATE TABLE approval_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_request_id UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    step_name VARCHAR(200) NOT NULL,
    approver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL CHECK (action IN ('Approved', 'Rejected', 'Returned')),
    comments TEXT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ah_request ON approval_history(approval_request_id);
CREATE INDEX idx_ah_approver ON approval_history(approver_id);

-- =====================================================
-- COMMON TABLES
-- =====================================================

-- Attachments
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    file_url TEXT NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_attachment_entity ON attachments(entity_type, entity_id);
CREATE INDEX idx_attachment_company ON attachments(company_id);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    entity_description VARCHAR(200),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_company ON audit_logs(company_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(20) DEFAULT 'Info' CHECK (notification_type IN ('Info', 'Success', 'Warning', 'Error')),
    entity_type VARCHAR(50),
    entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_user ON notifications(user_id);
CREATE INDEX idx_notification_read ON notifications(is_read);
CREATE INDEX idx_notification_created ON notifications(created_at);

-- Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comment_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_comment_user ON comments(user_id);
CREATE INDEX idx_comment_created ON comments(created_at);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS ON TABLES
-- =====================================================

COMMENT ON TABLE companies IS 'Main company/organization table';
COMMENT ON TABLE system_modules IS 'System modules registry for licensing and access control';
COMMENT ON TABLE module_licenses IS 'Company-specific module licenses';
COMMENT ON TABLE permissions IS 'Granular permissions for each module';
COMMENT ON TABLE role_module_access IS 'Module access rights for roles';
COMMENT ON TABLE user_module_access IS 'User-specific module access overrides';
COMMENT ON TABLE stock_balance IS 'Current stock levels per store and item';
COMMENT ON TABLE stock_transactions IS 'All inventory movements and transactions';
COMMENT ON TABLE audit_logs IS 'Complete audit trail of all system actions';

-- =====================================================
-- END OF SCHEMA
-- =====================================================

-- Verification Query
SELECT 
    schemaname,
    COUNT(*) as table_count
FROM pg_tables 
WHERE schemaname = 'public'
GROUP BY schemaname;
