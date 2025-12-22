# TWIST ERP Database Schema Review & Recommendations

## Schema Analysis

Your existing schema is **comprehensive and well-designed**. Here are my findings:

### ✅ **Excellent Coverage**

Your schema covers all major modules:
- ✅ System Configuration (Companies, Branches)
- ✅ User Management & Security (Users, Roles, Permissions)
- ✅ Project Management (Projects, Tasks, Project Orders)
- ✅ Fleet Management (Vehicles, Drivers, Fuel Logs, Trip Orders)
- ✅ Inventory Management (Items, Categories, Stores, Stock Balance, Transactions)
- ✅ Property Management (Properties, Units, Leases)
- ✅ Service & Maintenance (Service Requests, Work Orders, Preventive Maintenance)
- ✅ HR Management (Employees, Attendance, Leave, Payroll)
- ✅ Finance Management (Invoices, Expenses, Payment Vouchers)
- ✅ Workflows & Approvals
- ✅ Common Tables (Attachments, Audit Logs, Notifications, Comments)

---

## 🔧 **Recommended Additions & Corrections**

### 1. **Missing Tables**

#### A. **Suppliers/Vendors Table**
Currently, supplier information is stored as VARCHAR fields in multiple tables. A dedicated table would be better:

```sql
CREATE TABLE suppliers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    supplier_code VARCHAR(50) NOT NULL,
    supplier_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200),
    email VARCHAR(100),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    tax_id VARCHAR(50),
    payment_terms VARCHAR(200),
    credit_limit DECIMAL(15, 2),
    current_balance DECIMAL(15, 2) DEFAULT 0,
    supplier_type ENUM('Material', 'Service', 'Equipment', 'Both') DEFAULT 'Material',
    bank_name VARCHAR(100),
    bank_account VARCHAR(100),
    rating INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_supplier_code (company_id, supplier_code),
    INDEX idx_supplier_company (company_id),
    INDEX idx_supplier_active (is_active)
);
```

**Update Related Tables:**
- Add `supplier_id` to `project_orders`, `stock_transactions`, `expenses`
- Replace `supplier_name VARCHAR(200)` with foreign key reference

#### B. **Customers Table**
Similar to suppliers, customer data should be centralized:

```sql
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    customer_code VARCHAR(50) NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_type ENUM('Individual', 'Company', 'Government') DEFAULT 'Company',
    contact_person VARCHAR(200),
    email VARCHAR(100),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    tax_id VARCHAR(50),
    credit_limit DECIMAL(15, 2),
    current_balance DECIMAL(15, 2) DEFAULT 0,
    payment_terms VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_code (company_id, customer_code),
    INDEX idx_customer_company (company_id),
    INDEX idx_customer_active (is_active)
);
```

**Update Related Tables:**
- Add `customer_id` to `invoices`, `projects`
- Replace `customer_name`, `client_name` fields with foreign key

#### C. **Purchase Orders Table**
You have `project_orders` but missing general purchase orders:

```sql
CREATE TABLE purchase_orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    po_number VARCHAR(50) NOT NULL,
    supplier_id VARCHAR(36) NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    delivery_location VARCHAR(200),
    status ENUM('Draft', 'Pending', 'Approved', 'Partially Received', 'Received', 'Cancelled') DEFAULT 'Draft',
    subtotal DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    shipping_cost DECIMAL(15, 2) DEFAULT 0,
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
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_po_number (company_id, po_number),
    INDEX idx_po_company (company_id),
    INDEX idx_po_supplier (supplier_id),
    INDEX idx_po_status (status)
);

CREATE TABLE purchase_order_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    purchase_order_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    description TEXT,
    quantity DECIMAL(10, 2) NOT NULL,
    received_quantity DECIMAL(10, 2) DEFAULT 0,
    unit_price DECIMAL(15, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    discount_rate DECIMAL(5, 2) DEFAULT 0,
    line_total DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT,
    INDEX idx_poi_po (purchase_order_id),
    INDEX idx_poi_item (item_id)
);
```

#### D. **Requisitions Table**
For internal purchase requests:

```sql
CREATE TABLE requisitions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    requisition_number VARCHAR(50) NOT NULL,
    requisition_date DATE NOT NULL,
    requested_by VARCHAR(36) NOT NULL,
    department VARCHAR(100),
    project_id VARCHAR(36),
    required_date DATE,
    priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
    status ENUM('Draft', 'Pending', 'Approved', 'Rejected', 'Converted to PO', 'Cancelled') DEFAULT 'Draft',
    total_estimated_cost DECIMAL(15, 2) DEFAULT 0,
    purpose TEXT,
    notes TEXT,
    approved_by VARCHAR(36),
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_req_number (company_id, requisition_number),
    INDEX idx_req_company (company_id),
    INDEX idx_req_status (status),
    INDEX idx_req_requester (requested_by)
);

CREATE TABLE requisition_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    requisition_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36),
    item_description VARCHAR(200) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50),
    estimated_unit_price DECIMAL(15, 2),
    estimated_total DECIMAL(15, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL,
    INDEX idx_ri_requisition (requisition_id),
    INDEX idx_ri_item (item_id)
);
```

#### E. **Quotations Table**
For supplier quotations:

```sql
CREATE TABLE quotations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    quotation_number VARCHAR(50) NOT NULL,
    quotation_date DATE NOT NULL,
    supplier_id VARCHAR(36) NOT NULL,
    requisition_id VARCHAR(36),
    valid_until DATE,
    status ENUM('Draft', 'Sent', 'Received', 'Accepted', 'Rejected', 'Expired') DEFAULT 'Draft',
    subtotal DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    payment_terms VARCHAR(200),
    delivery_terms VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT,
    FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE SET NULL,
    UNIQUE KEY unique_quotation_number (company_id, quotation_number),
    INDEX idx_quot_company (company_id),
    INDEX idx_quot_supplier (supplier_id),
    INDEX idx_quot_status (status)
);

CREATE TABLE quotation_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    quotation_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36),
    description VARCHAR(200) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50),
    unit_price DECIMAL(15, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    discount_rate DECIMAL(5, 2) DEFAULT 0,
    line_total DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL,
    INDEX idx_qi_quotation (quotation_id)
);
```

#### F. **Chart of Accounts Table**
For proper accounting:

```sql
CREATE TABLE chart_of_accounts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    account_code VARCHAR(50) NOT NULL,
    account_name VARCHAR(200) NOT NULL,
    account_type ENUM('Asset', 'Liability', 'Equity', 'Revenue', 'Expense') NOT NULL,
    account_category VARCHAR(100),
    parent_account_id VARCHAR(36),
    is_header BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    opening_balance DECIMAL(15, 2) DEFAULT 0,
    current_balance DECIMAL(15, 2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_account_id) REFERENCES chart_of_accounts(id) ON DELETE SET NULL,
    UNIQUE KEY unique_account_code (company_id, account_code),
    INDEX idx_coa_company (company_id),
    INDEX idx_coa_type (account_type)
);
```

#### G. **Journal Entries Table**
For double-entry bookkeeping:

```sql
CREATE TABLE journal_entries (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    journal_number VARCHAR(50) NOT NULL,
    journal_date DATE NOT NULL,
    journal_type ENUM('General', 'Sales', 'Purchase', 'Payment', 'Receipt', 'Adjustment') DEFAULT 'General',
    reference_type VARCHAR(50),
    reference_id VARCHAR(36),
    description TEXT,
    total_debit DECIMAL(15, 2) DEFAULT 0,
    total_credit DECIMAL(15, 2) DEFAULT 0,
    status ENUM('Draft', 'Posted', 'Reversed') DEFAULT 'Draft',
    posted_by VARCHAR(36),
    posted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_journal_number (company_id, journal_number),
    INDEX idx_je_company (company_id),
    INDEX idx_je_date (journal_date),
    INDEX idx_je_status (status)
);

CREATE TABLE journal_entry_lines (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    journal_entry_id VARCHAR(36) NOT NULL,
    account_id VARCHAR(36) NOT NULL,
    description TEXT,
    debit_amount DECIMAL(15, 2) DEFAULT 0,
    credit_amount DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id) ON DELETE RESTRICT,
    INDEX idx_jel_entry (journal_entry_id),
    INDEX idx_jel_account (account_id)
);
```

#### H. **Departments Table**
Referenced in multiple places but not defined:

```sql
CREATE TABLE departments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    department_code VARCHAR(50) NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    manager_id VARCHAR(36),
    parent_department_id VARCHAR(36),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_department_id) REFERENCES departments(id) ON DELETE SET NULL,
    UNIQUE KEY unique_dept_code (company_id, department_code),
    INDEX idx_dept_company (company_id),
    INDEX idx_dept_branch (branch_id)
);
```

#### I. **Tax Rates Table**
For managing different tax rates:

```sql
CREATE TABLE tax_rates (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    tax_code VARCHAR(50) NOT NULL,
    tax_name VARCHAR(200) NOT NULL,
    tax_rate DECIMAL(5, 2) NOT NULL,
    tax_type ENUM('VAT', 'Sales Tax', 'Service Tax', 'Withholding Tax', 'Other') DEFAULT 'VAT',
    is_compound BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tax_code (company_id, tax_code),
    INDEX idx_tax_company (company_id)
);
```

#### J. **Payment Receipts Table**
To track invoice payments:

```sql
CREATE TABLE payment_receipts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    branch_id VARCHAR(36),
    receipt_number VARCHAR(50) NOT NULL,
    receipt_date DATE NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    invoice_id VARCHAR(36),
    amount DECIMAL(15, 2) NOT NULL,
    payment_method ENUM('Cash', 'Bank Transfer', 'Cheque', 'Credit Card', 'Mobile Money') DEFAULT 'Cash',
    cheque_number VARCHAR(50),
    bank_name VARCHAR(100),
    transaction_reference VARCHAR(100),
    notes TEXT,
    status ENUM('Draft', 'Confirmed', 'Cancelled') DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
    UNIQUE KEY unique_receipt_number (company_id, receipt_number),
    INDEX idx_pr_company (company_id),
    INDEX idx_pr_customer (customer_id),
    INDEX idx_pr_invoice (invoice_id)
);
```

---

### 2. **Schema Corrections & Improvements**

#### A. **Items Table - Add Location Field**
```sql
ALTER TABLE items ADD COLUMN warehouse_location VARCHAR(100) AFTER barcode;
```

#### B. **Users Table - Add Foreign Key for Role**
```sql
ALTER TABLE users 
ADD CONSTRAINT fk_user_role 
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;
```

#### C. **Employees Table - Add Department Foreign Key**
```sql
ALTER TABLE employees 
ADD COLUMN department_id VARCHAR(36) AFTER branch_id,
ADD CONSTRAINT fk_employee_department 
FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- Update the department field to be deprecated
ALTER TABLE employees MODIFY COLUMN department VARCHAR(100) COMMENT 'Deprecated - use department_id';
```

#### D. **Add Missing Indexes for Performance**
```sql
-- Add composite indexes for common queries
CREATE INDEX idx_stock_balance_low_stock ON stock_balance(company_id, quantity, item_id);
CREATE INDEX idx_invoice_customer_status ON invoices(customer_name, status, invoice_date);
CREATE INDEX idx_expense_project_date ON expenses(project_id, expense_date);
CREATE INDEX idx_attendance_employee_month ON attendance(employee_id, attendance_date);
```

---

### 3. **Additional Recommended Tables**

#### K. **Email Templates Table**
```sql
CREATE TABLE email_templates (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    template_code VARCHAR(50) NOT NULL,
    template_name VARCHAR(200) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    variables JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_template_code (company_id, template_code)
);
```

#### L. **System Settings Table**
```sql
CREATE TABLE system_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id VARCHAR(36) NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_type ENUM('String', 'Number', 'Boolean', 'JSON') DEFAULT 'String',
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_setting_key (company_id, setting_key),
    INDEX idx_settings_company (company_id)
);
```

---

## 📊 **Summary**

### Tables to Add (Priority Order):
1. ✅ **suppliers** - Critical for procurement
2. ✅ **customers** - Critical for sales/invoicing
3. ✅ **purchase_orders** + items - Core procurement
4. ✅ **requisitions** + items - Internal requests
5. ✅ **departments** - Organizational structure
6. ✅ **quotations** + items - Supplier quotes
7. ✅ **payment_receipts** - Customer payments
8. ✅ **tax_rates** - Tax management
9. ✅ **chart_of_accounts** - Accounting
10. ✅ **journal_entries** + lines - Double-entry bookkeeping
11. ⚠️ **email_templates** - Optional but useful
12. ⚠️ **system_settings** - Optional but useful

### Schema Improvements:
- Add foreign key constraints where missing
- Add composite indexes for performance
- Normalize supplier/customer data
- Add department foreign keys

Your existing schema is **excellent** - these additions will make it production-ready for a complete ERP system!
