# TWIST ERP - PostgreSQL Database Schema
## Complete Schema with Module Licensing System

---

## 📋 Overview

This PostgreSQL database schema provides a **complete ERP solution** with an advanced **module licensing and permission system**. Every module in your navigation is registered in the database, allowing for:

- ✅ **Per-company module licensing**
- ✅ **Role-based access control (RBAC)**
- ✅ **User-specific permission overrides**
- ✅ **Granular CRUD permissions per module**
- ✅ **License expiration management**
- ✅ **User limits per module**

---

## 🗂️ Database Files

| File | Description |
|------|-------------|
| `01-schema-core.sql` | Core tables: Companies, Branches, Modules, Licenses, Users, Roles, Permissions |
| `02-modules-seeding.sql` | **Complete module registration** based on your navigation structure + permission seeding |
| `03-business-tables.sql` | *(To be created)* All business module tables (Projects, Fleet, Inventory, HR, Finance, etc.) |

---

## 🔐 Module Licensing System

### How It Works

#### 1. **Module Registration** (`system_modules` table)
Every item in your navigation is registered as a module:

```sql
-- Example: Projects module
INSERT INTO system_modules (
    module_code,        -- 'projects'
    module_name,        -- 'Projects'
    module_category,    -- 'Project Management'
    parent_module_id,   -- Link to parent category
    icon_name,          -- 'HardHat' (Lucide icon)
    route_path,         -- '/projects'
    requires_license    -- TRUE/FALSE
) VALUES (...);
```

**Hierarchy Example:**
```
Project Management (parent)
├── Projects
├── Tasks
└── Project Orders
```

#### 2. **Company Licensing** (`module_licenses` table)
Each company must have a license to access a module:

```sql
INSERT INTO module_licenses (
    company_id,
    module_id,
    is_active,
    valid_from,
    valid_until,
    max_users,          -- NULL = unlimited
    features            -- JSONB for module-specific features
) VALUES (...);
```

**License Validation:**
- ✅ Check if license exists
- ✅ Check if license is active
- ✅ Check if within validity period
- ✅ Check if user limit not exceeded

#### 3. **Permissions** (`permissions` table)
Each module has granular permissions auto-generated:

- `{module_code}.view` - View data
- `{module_code}.create` - Create new records
- `{module_code}.edit` - Edit existing records
- `{module_code}.delete` - Delete records
- `{module_code}.export` - Export data
- `{module_code}.approve` - Approve transactions (for approval modules)

#### 4. **Role-Based Access** (`role_module_access` table)
Roles define what modules users can access:

```sql
INSERT INTO role_module_access (
    role_id,
    module_id,
    can_view,
    can_create,
    can_edit,
    can_delete,
    can_approve,
    can_export
) VALUES (...);
```

#### 5. **User Overrides** (`user_module_access` table)
Override role permissions for specific users:

```sql
INSERT INTO user_module_access (
    user_id,
    module_id,
    is_granted,         -- TRUE = grant, FALSE = revoke
    can_view,
    can_create,
    ...
) VALUES (...);
```

---

## 📊 Registered Modules

Based on your navigation structure, **40+ modules** are registered:

### Core Modules
- ✅ Dashboard (always available, no license required)

### Business Modules (Require License)

#### Project Management
- Projects
- Tasks
- Project Orders

#### Fleet Management
- Vehicles
- Drivers
- Fuel Logs
- Trip Orders

#### Inventory
**Master Data:**
- Items
- Categories
- Stores/Warehouses

**Operations:**
- Goods Receiving
- Store Issue
- Store Transfer
- Item Requisition
- Stock Adjustment
- Purchase Return
- Item Disposal

**Reports:**
- Stock Movements

#### Property Management
- Properties
- Units
- Lease Orders

#### Service & Maintenance
- Service Requests
- Work Orders
- Preventive Maintenance

#### HR Management
- Employees
- Attendance
- Leave Management
- Payroll Management

#### Finance
- Invoices
- Expenses
- Payment Vouchers

### System Settings (Core - No License Required)

#### Organization
- Company Profile
- Document Numbering
- Approval Workflows

#### Access Control
- Users
- Roles & Permissions

#### Logs
- Audit Logs

---

## 🔧 Usage Examples

### 1. Grant Module License to Company

```sql
-- Grant Projects module to a company
INSERT INTO module_licenses (
    company_id,
    module_id,
    is_active,
    valid_from,
    valid_until,
    max_users
)
SELECT 
    '123e4567-e89b-12d3-a456-426614174000'::UUID,  -- company_id
    id,
    TRUE,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 year',
    10  -- Max 10 users
FROM system_modules
WHERE module_code = 'projects';
```

### 2. Create Role with Module Access

```sql
-- Create a Project Manager role
INSERT INTO roles (company_id, role_name, description)
VALUES (
    '123e4567-e89b-12d3-a456-426614174000'::UUID,
    'Project Manager',
    'Can manage all project-related modules'
);

-- Grant full access to Projects module
INSERT INTO role_module_access (
    role_id,
    module_id,
    can_view,
    can_create,
    can_edit,
    can_delete,
    can_approve
)
SELECT 
    (SELECT id FROM roles WHERE role_name = 'Project Manager' LIMIT 1),
    id,
    TRUE, TRUE, TRUE, TRUE, TRUE
FROM system_modules
WHERE module_code = 'projects';
```

### 3. Check User Access to Module

```sql
-- Function to check if user has access to a module
CREATE OR REPLACE FUNCTION check_user_module_access(
    p_user_id UUID,
    p_module_code VARCHAR,
    p_permission_type VARCHAR  -- 'view', 'create', 'edit', 'delete', 'approve'
) RETURNS BOOLEAN AS $$
DECLARE
    v_has_access BOOLEAN := FALSE;
    v_company_id UUID;
    v_module_id UUID;
    v_role_id UUID;
BEGIN
    -- Get user's company and role
    SELECT company_id, role_id INTO v_company_id, v_role_id
    FROM users WHERE id = p_user_id;
    
    -- Get module ID
    SELECT id INTO v_module_id FROM system_modules WHERE module_code = p_module_code;
    
    -- Check if company has license
    IF NOT EXISTS (
        SELECT 1 FROM module_licenses
        WHERE company_id = v_company_id
        AND module_id = v_module_id
        AND is_active = TRUE
        AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
    ) THEN
        RETURN FALSE;
    END IF;
    
    -- Check user-specific override first
    SELECT 
        CASE p_permission_type
            WHEN 'view' THEN can_view
            WHEN 'create' THEN can_create
            WHEN 'edit' THEN can_edit
            WHEN 'delete' THEN can_delete
            WHEN 'approve' THEN can_approve
        END INTO v_has_access
    FROM user_module_access
    WHERE user_id = p_user_id AND module_id = v_module_id;
    
    -- If no user override, check role permissions
    IF v_has_access IS NULL THEN
        SELECT 
            CASE p_permission_type
                WHEN 'view' THEN can_view
                WHEN 'create' THEN can_create
                WHEN 'edit' THEN can_edit
                WHEN 'delete' THEN can_delete
                WHEN 'approve' THEN can_approve
            END INTO v_has_access
        FROM role_module_access
        WHERE role_id = v_role_id AND module_id = v_module_id;
    END IF;
    
    RETURN COALESCE(v_has_access, FALSE);
END;
$$ LANGUAGE plpgsql;

-- Usage:
-- SELECT check_user_module_access('user-uuid', 'projects', 'create');
```

---

## 🚀 Installation Steps

### 1. Create Database
```bash
createdb twist_erp
```

### 2. Run Schema Files in Order
```bash
psql -U postgres -d twist_erp -f 01-schema-core.sql
psql -U postgres -d twist_erp -f 02-modules-seeding.sql
psql -U postgres -d twist_erp -f 03-business-tables.sql
```

### 3. Verify Installation
```sql
-- Check registered modules
SELECT COUNT(*) FROM system_modules;
-- Should return 40+

-- Check permissions
SELECT COUNT(*) FROM permissions;
-- Should return 200+ (5-6 permissions per module)

-- View module hierarchy
SELECT 
    COALESCE(p.module_name, 'ROOT') as parent,
    m.module_name as module,
    m.route_path,
    m.requires_license
FROM system_modules m
LEFT JOIN system_modules p ON m.parent_module_id = p.id
ORDER BY p.display_order, m.display_order;
```

---

## 📝 Next Steps

1. ✅ **Complete Business Tables** - Create `03-business-tables.sql` with all business module tables
2. ✅ **Create .NET Backend** - Entity Framework Core models and repositories
3. ✅ **Implement Authorization Middleware** - Check module licenses and permissions
4. ✅ **Create Admin Panel** - Manage licenses, roles, and permissions
5. ✅ **Build API Endpoints** - RESTful APIs for all modules

---

## 🔒 Security Features

- **Password Hashing**: Use `pgcrypto` extension for secure password storage
- **Audit Logging**: Track all user actions
- **Row-Level Security**: PostgreSQL RLS for multi-tenant data isolation
- **License Validation**: Automatic license expiry checks
- **User Locking**: Failed login attempt tracking

---

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [ASP.NET Core Authorization](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/)

---

## 💡 Key Benefits

1. **Flexible Licensing** - Enable/disable modules per company
2. **Granular Permissions** - Control exactly what users can do
3. **Scalable** - Supports unlimited companies and users
4. **Auditable** - Complete audit trail of all actions
5. **Extensible** - Easy to add new modules and permissions

---

**Created for TWIST ERP**  
*Construction Company Management System*
