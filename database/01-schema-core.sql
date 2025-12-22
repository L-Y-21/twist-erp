-- =====================================================
-- TWIST ERP - Complete PostgreSQL Database Schema
-- Construction Company Management System
-- Version: 2.0 - PostgreSQL Edition
-- =====================================================
-- 
-- This schema includes:
-- 1. System Configuration & Module Licensing
-- 2. User Management & Permissions
-- 3. All Business Modules (Projects, Fleet, Inventory, HR, Finance, etc.)
-- 4. Module Registration based on Navigation Structure
-- 5. Permission Seeding
--
-- =====================================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- DROP EXISTING TABLES (For Clean Installation)
-- =====================================================
-- Uncomment below to drop all tables for fresh install
/*
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
*/

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

COMMENT ON TABLE companies IS 'Main company/organization table';

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

-- =====================================================
-- MODULE LICENSING & PERMISSIONS SYSTEM
-- =====================================================

-- System Modules (Based on Navigation Structure)
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

COMMENT ON TABLE system_modules IS 'System modules registry for licensing and access control';

-- Module Licenses (Company-specific)
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

-- Permissions (Granular permissions per module)
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

-- User Module Access (User-specific overrides)
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

-- NOTE: Due to message length limits, I'll create the complete schema in a downloadable format.
-- The full schema includes all tables from your original MySQL schema converted to PostgreSQL.
-- This file will be continued in part 2 with all business module tables.

