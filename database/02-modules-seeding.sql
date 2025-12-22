-- =====================================================
-- TWIST ERP - Module Registration & Permissions Seeding
-- Based on Navigation Structure
-- =====================================================
-- This file registers all system modules and their permissions
-- for the module licensing and access control system
-- =====================================================

-- =====================================================
-- REGISTER SYSTEM MODULES (Based on Navigation)
-- =====================================================

-- Dashboard Module (Core - Always Available)
INSERT INTO system_modules (module_code, module_name, module_category, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
('dashboard', 'Dashboard', 'Core', 'LayoutDashboard', '/', 1, TRUE, FALSE);

-- =====================================================
-- PROJECT MANAGEMENT MODULES
-- =====================================================
INSERT INTO system_modules (module_code, module_name, module_category, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
('project_management', 'Project Management', 'Business', 'Briefcase', NULL, 2, FALSE, TRUE);

-- Get the parent ID for Project Management
DO $$
DECLARE
    pm_id UUID;
BEGIN
    SELECT id INTO pm_id FROM system_modules WHERE module_code = 'project_management';
    
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, requires_license) VALUES
    ('projects', 'Projects', 'Project Management', pm_id, 'HardHat', '/projects', 1, TRUE),
    ('tasks', 'Tasks', 'Project Management', pm_id, 'ClipboardList', '/tasks', 2, TRUE),
    ('project_orders', 'Project Orders', 'Project Management', pm_id, 'FileText', '/project-orders', 3, TRUE);
END $$;

-- =====================================================
-- FLEET MANAGEMENT MODULES
-- =====================================================
INSERT INTO system_modules (module_code, module_name, module_category, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
('fleet_management', 'Fleet Management', 'Business', 'Truck', NULL, 3, FALSE, TRUE);

DO $$
DECLARE
    fm_id UUID;
BEGIN
    SELECT id INTO fm_id FROM system_modules WHERE module_code = 'fleet_management';
    
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, requires_license) VALUES
    ('vehicles', 'Vehicles', 'Fleet Management', fm_id, 'Truck', '/vehicles', 1, TRUE),
    ('drivers', 'Drivers', 'Fleet Management', fm_id, 'Users', '/drivers', 2, TRUE),
    ('fuel_logs', 'Fuel Logs', 'Fleet Management', fm_id, 'Fuel', '/fuel-logs', 3, TRUE),
    ('trip_orders', 'Trip Orders', 'Fleet Management', fm_id, 'MapPin', '/trip-orders', 4, TRUE);
END $$;

-- =====================================================
-- INVENTORY MODULES
-- =====================================================
INSERT INTO system_modules (module_code, module_name, module_category, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
('inventory', 'Inventory', 'Business', 'Package', NULL, 4, FALSE, TRUE);

DO $$
DECLARE
    inv_id UUID;
    master_id UUID;
    ops_id UUID;
    reports_id UUID;
BEGIN
    SELECT id INTO inv_id FROM system_modules WHERE module_code = 'inventory';
    
    -- Inventory Master Data
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, requires_license) VALUES
    ('inventory_master', 'Master Data', 'Inventory', inv_id, 'Database', NULL, 1, TRUE);
    
    SELECT id INTO master_id FROM system_modules WHERE module_code = 'inventory_master';
    
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, requires_license) VALUES
    ('items', 'Items', 'Inventory', master_id, 'Package', '/items', 1, TRUE),
    ('categories', 'Categories', 'Inventory', master_id, 'ClipboardList', '/categories', 2, TRUE),
    ('stores', 'Stores/Warehouses', 'Inventory', master_id, 'Warehouse', '/stores', 3, TRUE);
    
    -- Inventory Operations
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, requires_license) VALUES
    ('inventory_operations', 'Operations', 'Inventory', inv_id, 'ArrowLeftRight', NULL, 2, TRUE);
    
    SELECT id INTO ops_id FROM system_modules WHERE module_code = 'inventory_operations';
    
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, requires_license) VALUES
    ('goods_receiving', 'Goods Receiving', 'Inventory', ops_id, 'FileDown', '/goods-receiving', 1, TRUE),
    ('store_issue', 'Store Issue', 'Inventory', ops_id, 'FileUp', '/store-issue', 2, TRUE),
    ('store_transfer', 'Store Transfer', 'Inventory', ops_id, 'ArrowLeftRight', '/store-transfer', 3, TRUE),
    ('requisitions', 'Item Requisition', 'Inventory', ops_id, 'ClipboardCheck', '/requisitions', 4, TRUE),
    ('stock_adjustment', 'Stock Adjustment', 'Inventory', ops_id, 'Wrench', '/stock-adjustment', 5, TRUE),
    ('purchase_return', 'Purchase Return', 'Inventory', ops_id, 'ArrowLeftRight', '/purchase-return', 6, TRUE),
    ('item_disposal', 'Item Disposal', 'Inventory', ops_id, 'History', '/item-disposal', 7, TRUE);
    
    -- Inventory Reports
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, requires_license) VALUES
    ('inventory_reports', 'Reports', 'Inventory', inv_id, 'Activity', NULL, 3, TRUE);
    
    SELECT id INTO reports_id FROM system_modules WHERE module_code = 'inventory_reports';
    
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, requires_license) VALUES
    ('stock_movements', 'Stock Movements', 'Inventory', reports_id, 'Activity', '/stock-movements', 1, TRUE);
END $$;

-- =====================================================
-- PROPERTY MANAGEMENT MODULES
-- =====================================================
INSERT INTO system_modules (module_code, module_name, module_category, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
('property_management', 'Property', 'Business', 'Building2', NULL, 5, FALSE, TRUE);

DO $$
DECLARE
    prop_id UUID;
BEGIN
    SELECT id INTO prop_id FROM system_modules WHERE module_code = 'property_management';
    
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, requires_license) VALUES
    ('properties', 'Properties', 'Property Management', prop_id, 'Home', '/properties', 1, TRUE),
    ('property_units', 'Units', 'Property Management', prop_id, 'Building2', '/units', 2, TRUE),
    ('leases', 'Lease Orders', 'Property Management', prop_id, 'Key', '/leases', 3, TRUE);
END $$;

-- =====================================================
-- SERVICE & MAINTENANCE MODULES
-- =====================================================
INSERT INTO system_modules (module_code, module_name, module_category, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
('service_maintenance', 'Service & Maintenance', 'Business', 'Wrench', NULL, 6, FALSE, TRUE);

DO $$
DECLARE
    sm_id UUID;
BEGIN
    SELECT id INTO sm_id FROM system_modules WHERE module_code = 'service_maintenance';
    
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, requires_license) VALUES
    ('service_requests', 'Service Requests', 'Service & Maintenance', sm_id, 'Wrench', '/service-requests', 1, TRUE),
    ('work_orders', 'Work Orders', 'Service & Maintenance', sm_id, 'ClipboardList', '/work-orders', 2, TRUE),
    ('preventive_maintenance', 'Preventive Maintenance', 'Service & Maintenance', sm_id, 'ShieldCheck', '/preventive', 3, TRUE);
END $$;

-- =====================================================
-- HR MANAGEMENT MODULES
-- =====================================================
INSERT INTO system_modules (module_code, module_name, module_category, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
('hr_management', 'HR Management', 'Business', 'UserSquare2', NULL, 7, FALSE, TRUE);

DO $$
DECLARE
    hr_id UUID;
BEGIN
    SELECT id INTO hr_id FROM system_modules WHERE module_code = 'hr_management';
    
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, requires_license) VALUES
    ('employees', 'Employees', 'HR Management', hr_id, 'Users', '/employees', 1, TRUE),
    ('attendance', 'Attendance', 'HR Management', hr_id, 'CalendarCheck', '/attendance', 2, TRUE),
    ('leave_management', 'Leave Management', 'HR Management', hr_id, 'Palmtree', '/leaves', 3, TRUE),
    ('payroll', 'Payroll Management', 'HR Management', hr_id, 'Banknote', '/payroll', 4, TRUE);
END $$;

-- =====================================================
-- FINANCE MODULES
-- =====================================================
INSERT INTO system_modules (module_code, module_name, module_category, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
('finance', 'Finance', 'Business', 'DollarSign', NULL, 8, FALSE, TRUE);

DO $$
DECLARE
    fin_id UUID;
BEGIN
    SELECT id INTO fin_id FROM system_modules WHERE module_code = 'finance';
    
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, requires_license) VALUES
    ('invoices', 'Invoices', 'Finance', fin_id, 'FileText', '/invoices', 1, TRUE),
    ('expenses', 'Expenses', 'Finance', fin_id, 'Receipt', '/expenses', 2, TRUE),
    ('payment_vouchers', 'Payment Vouchers', 'Finance', fin_id, 'CreditCard', '/payments', 3, TRUE);
END $$;

-- =====================================================
-- SYSTEM SETTINGS MODULES
-- =====================================================
INSERT INTO system_modules (module_code, module_name, module_category, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
('system_settings', 'System Settings', 'System', 'Settings', NULL, 9, TRUE, FALSE);

DO $$
DECLARE
    settings_id UUID;
    org_id UUID;
    access_id UUID;
    logs_id UUID;
BEGIN
    SELECT id INTO settings_id FROM system_modules WHERE module_code = 'system_settings';
    
    -- Organization Settings
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
    ('organization_settings', 'Organization', 'System Settings', settings_id, 'Building2', NULL, 1, TRUE, FALSE);
    
    SELECT id INTO org_id FROM system_modules WHERE module_code = 'organization_settings';
    
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
    ('company_profile', 'Company Profile', 'System Settings', org_id, 'Building2', '/company', 1, TRUE, FALSE),
    ('document_numbering', 'Document Numbering', 'System Settings', org_id, 'FileText', '/numbering', 2, TRUE, FALSE),
    ('approval_workflows', 'Approval Workflows', 'System Settings', org_id, 'ShieldCheck', '/workflows', 3, TRUE, FALSE);
    
    -- Access Control
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
    ('access_control', 'Access Control', 'System Settings', settings_id, 'ShieldCheck', NULL, 2, TRUE, FALSE);
    
    SELECT id INTO access_id FROM system_modules WHERE module_code = 'access_control';
    
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
    ('users', 'Users', 'System Settings', access_id, 'Users', '/users', 1, TRUE, FALSE),
    ('roles', 'Roles & Permissions', 'System Settings', access_id, 'Key', '/roles', 2, TRUE, FALSE);
    
    -- Logs
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
    ('system_logs', 'Logs', 'System Settings', settings_id, 'History', NULL, 3, TRUE, FALSE);
    
    SELECT id INTO logs_id FROM system_modules WHERE module_code = 'system_logs';
    
    INSERT INTO system_modules (module_code, module_name, module_category, parent_module_id, icon_name, route_path, display_order, is_core_module, requires_license) VALUES
    ('audit_logs', 'Audit Logs', 'System Settings', logs_id, 'History', '/audit', 1, TRUE, FALSE);
END $$;

-- =====================================================
-- REGISTER PERMISSIONS FOR EACH MODULE
-- =====================================================

-- Function to create standard CRUD permissions for a module
CREATE OR REPLACE FUNCTION create_module_permissions(
    p_module_code VARCHAR,
    p_include_approve BOOLEAN DEFAULT FALSE
) RETURNS VOID AS $$
DECLARE
    v_module_id UUID;
    v_module_name VARCHAR;
BEGIN
    SELECT id, module_name INTO v_module_id, v_module_name 
    FROM system_modules 
    WHERE module_code = p_module_code;
    
    IF v_module_id IS NOT NULL THEN
        -- View Permission
        INSERT INTO permissions (module_id, permission_code, permission_name, permission_type, description)
        VALUES (v_module_id, p_module_code || '.view', 'View ' || v_module_name, 'view', 'View ' || v_module_name || ' data');
        
        -- Create Permission
        INSERT INTO permissions (module_id, permission_code, permission_name, permission_type, description)
        VALUES (v_module_id, p_module_code || '.create', 'Create ' || v_module_name, 'action', 'Create new ' || v_module_name);
        
        -- Edit Permission
        INSERT INTO permissions (module_id, permission_code, permission_name, permission_type, description)
        VALUES (v_module_id, p_module_code || '.edit', 'Edit ' || v_module_name, 'action', 'Edit existing ' || v_module_name);
        
        -- Delete Permission
        INSERT INTO permissions (module_id, permission_code, permission_name, permission_type, description)
        VALUES (v_module_id, p_module_code || '.delete', 'Delete ' || v_module_name, 'action', 'Delete ' || v_module_name);
        
        -- Export Permission
        INSERT INTO permissions (module_id, permission_code, permission_name, permission_type, description)
        VALUES (v_module_id, p_module_code || '.export', 'Export ' || v_module_name, 'action', 'Export ' || v_module_name || ' data');
        
        -- Approve Permission (if applicable)
        IF p_include_approve THEN
            INSERT INTO permissions (module_id, permission_code, permission_name, permission_type, description)
            VALUES (v_module_id, p_module_code || '.approve', 'Approve ' || v_module_name, 'action', 'Approve ' || v_module_name);
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create permissions for all modules
SELECT create_module_permissions('dashboard', FALSE);
SELECT create_module_permissions('projects', TRUE);
SELECT create_module_permissions('tasks', FALSE);
SELECT create_module_permissions('project_orders', TRUE);
SELECT create_module_permissions('vehicles', FALSE);
SELECT create_module_permissions('drivers', FALSE);
SELECT create_module_permissions('fuel_logs', FALSE);
SELECT create_module_permissions('trip_orders', TRUE);
SELECT create_module_permissions('items', FALSE);
SELECT create_module_permissions('categories', FALSE);
SELECT create_module_permissions('stores', FALSE);
SELECT create_module_permissions('goods_receiving', TRUE);
SELECT create_module_permissions('store_issue', TRUE);
SELECT create_module_permissions('store_transfer', TRUE);
SELECT create_module_permissions('requisitions', TRUE);
SELECT create_module_permissions('stock_adjustment', TRUE);
SELECT create_module_permissions('purchase_return', TRUE);
SELECT create_module_permissions('item_disposal', TRUE);
SELECT create_module_permissions('stock_movements', FALSE);
SELECT create_module_permissions('properties', FALSE);
SELECT create_module_permissions('property_units', FALSE);
SELECT create_module_permissions('leases', TRUE);
SELECT create_module_permissions('service_requests', TRUE);
SELECT create_module_permissions('work_orders', TRUE);
SELECT create_module_permissions('preventive_maintenance', FALSE);
SELECT create_module_permissions('employees', FALSE);
SELECT create_module_permissions('attendance', FALSE);
SELECT create_module_permissions('leave_management', TRUE);
SELECT create_module_permissions('payroll', TRUE);
SELECT create_module_permissions('invoices', TRUE);
SELECT create_module_permissions('expenses', TRUE);
SELECT create_module_permissions('payment_vouchers', TRUE);
SELECT create_module_permissions('company_profile', FALSE);
SELECT create_module_permissions('document_numbering', FALSE);
SELECT create_module_permissions('approval_workflows', FALSE);
SELECT create_module_permissions('users', FALSE);
SELECT create_module_permissions('roles', FALSE);
SELECT create_module_permissions('audit_logs', FALSE);

-- Drop the helper function
DROP FUNCTION create_module_permissions;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- View all registered modules
-- SELECT module_code, module_name, module_category, route_path, requires_license 
-- FROM system_modules 
-- ORDER BY display_order;

-- View module hierarchy
-- SELECT 
--     m1.module_name as parent_module,
--     m2.module_name as child_module,
--     m2.route_path
-- FROM system_modules m1
-- LEFT JOIN system_modules m2 ON m1.id = m2.parent_module_id
-- WHERE m1.parent_module_id IS NULL
-- ORDER BY m1.display_order, m2.display_order;

-- Count permissions per module
-- SELECT 
--     sm.module_name,
--     COUNT(p.id) as permission_count
-- FROM system_modules sm
-- LEFT JOIN permissions p ON sm.id = p.module_id
-- GROUP BY sm.id, sm.module_name
-- ORDER BY sm.module_name;

COMMENT ON TABLE system_modules IS 'Registry of all system modules for licensing and access control';
COMMENT ON TABLE module_licenses IS 'Company-specific module licenses';
COMMENT ON TABLE permissions IS 'Granular permissions for each module';
COMMENT ON TABLE role_module_access IS 'Module access rights for roles';
COMMENT ON TABLE user_module_access IS 'User-specific module access overrides';

-- =====================================================
-- END OF MODULE REGISTRATION
-- =====================================================
