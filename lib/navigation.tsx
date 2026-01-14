import type React from "react"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Truck,
  Package,
  Building2,
  Wrench,
  UserSquare2,
  DollarSign,
  Settings,
  HardHat,
  ClipboardList,
  Fuel,
  MapPin,
  Warehouse,
  FileDown,
  FileUp,
  ArrowLeftRight,
  ClipboardCheck,
  History,
  Home,
  Key,
  CalendarCheck,
  Palmtree,
  Banknote,
  Receipt,
  CreditCard,
  ShieldCheck,
  FileText,
  Activity,
  Database,
} from "lucide-react"

interface NavItem {
  title: string
  icon: React.ReactNode
  href?: string
  children?: NavItem[]
}

export const navigationConfig: NavItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: "/",
  },

  {
    title: "Inventory",
    icon: <Package className="h-4 w-4" />,
    children: [
      {
        title: "Master Data",
        icon: <Database className="h-3 w-3" />,
        children: [
          { title: "Items", icon: <Package className="h-4 w-4" />, href: "/items" },
          { title: "Categories", icon: <ClipboardList className="h-4 w-4" />, href: "/categories" },
          { title: "Stores/Warehouses", icon: <Warehouse className="h-4 w-4" />, href: "/stores" },
        ]
      },
      {
        title: "Operations",
        icon: <ArrowLeftRight className="h-3 w-3" />,
        children: [
          { title: "Goods Receiving", icon: <FileDown className="h-4 w-4" />, href: "/goods-receiving" },
          { title: "Store Issue", icon: <FileUp className="h-4 w-4" />, href: "/store-issue" },
          { title: "Store Transfer", icon: <ArrowLeftRight className="h-4 w-4" />, href: "/store-transfer" },
          { title: "Item Requisition", icon: <ClipboardCheck className="h-4 w-4" />, href: "/requisitions" },
          { title: "Stock Adjustment", icon: <Wrench className="h-4 w-4" />, href: "/stock-adjustment" },
          { title: "Purchase Return", icon: <ArrowLeftRight className="h-4 w-4" />, href: "/purchase-return" },
          { title: "Item Disposal", icon: <History className="h-4 w-4" />, href: "/item-disposal" },
        ]
      },
      {
        title: "Reports",
        icon: <Activity className="h-3 w-3" />,
        children: [
          { title: "Stock Movements", icon: <Activity className="h-4 w-4" />, href: "/stock-movements" },
        ]
      },
    ],
  },

  {
    title: "Project Management",
    icon: <Briefcase className="h-4 w-4" />,
    children: [
      { title: "Projects", icon: <HardHat className="h-4 w-4" />, href: "/projects" },
      { title: "Tasks", icon: <ClipboardList className="h-4 w-4" />, href: "/tasks" },
      { title: "Project Orders", icon: <FileText className="h-4 w-4" />, href: "/project-orders" },
    ],
  },
  {
    title: "Fleet Management",
    icon: <Truck className="h-4 w-4" />,
    children: [
      { title: "Vehicles", icon: <Truck className="h-4 w-4" />, href: "/vehicles" },
      { title: "Drivers", icon: <Users className="h-4 w-4" />, href: "/drivers" },
      { title: "Fuel Logs", icon: <Fuel className="h-4 w-4" />, href: "/fuel-logs" },
      { title: "Trip Orders", icon: <MapPin className="h-4 w-4" />, href: "/trip-orders" },
    ],
  },
  {
    title: "Property",
    icon: <Building2 className="h-4 w-4" />,
    children: [
      { title: "Properties", icon: <Home className="h-4 w-4" />, href: "/properties" },
      { title: "Units", icon: <Building2 className="h-4 w-4" />, href: "/units" },
      { title: "Lease Orders", icon: <Key className="h-4 w-4" />, href: "/leases" },
    ],
  },
  {
    title: "Service & Maintenance",
    icon: <Wrench className="h-4 w-4" />,
    children: [
      { title: "Service Requests", icon: <Wrench className="h-4 w-4" />, href: "/service-requests" },
      { title: "Work Orders", icon: <ClipboardList className="h-4 w-4" />, href: "/work-orders" },
      { title: "Preventive Maintenance", icon: <ShieldCheck className="h-4 w-4" />, href: "/preventive" },
    ],
  },
  {
    title: "HR Management",
    icon: <UserSquare2 className="h-4 w-4" />,
    children: [
      { title: "Employees", icon: <Users className="h-4 w-4" />, href: "/employees" },
      { title: "Attendance", icon: <CalendarCheck className="h-4 w-4" />, href: "/attendance" },
      { title: "Leave Management", icon: <Palmtree className="h-4 w-4" />, href: "/leaves" },
      { title: "Payroll Management", icon: <Banknote className="h-4 w-4" />, href: "/payroll" },
    ],
  },
  {
    title: "Finance",
    icon: <DollarSign className="h-4 w-4" />,
    children: [
      { title: "Invoices", icon: <FileText className="h-4 w-4" />, href: "/invoices" },
      { title: "Expenses", icon: <Receipt className="h-4 w-4" />, href: "/expenses" },
      { title: "Payment Vouchers", icon: <CreditCard className="h-4 w-4" />, href: "/payments" },
    ],
  },
  {
    title: "System Settings",
    icon: <Settings className="h-4 w-4" />,
    children: [
      {
        title: "Organization",
        icon: <Building2 className="h-3 w-3" />,
        children: [
          { title: "Company Profile", icon: <Building2 className="h-4 w-4" />, href: "/company" },
          { title: "Document Numbering", icon: <FileText className="h-4 w-4" />, href: "/numbering" },
          { title: "Approval Workflows", icon: <ShieldCheck className="h-4 w-4" />, href: "/workflows" },
        ]
      },
      {
        title: "Access Control",
        icon: <ShieldCheck className="h-3 w-3" />,
        children: [
          { title: "Users", icon: <Users className="h-4 w-4" />, href: "/users" },
          { title: "Roles & Permissions", icon: <Key className="h-4 w-4" />, href: "/roles" },
        ]
      },
      {
        title: "Logs",
        icon: <History className="h-3 w-3" />,
        children: [
          { title: "Audit Logs", icon: <History className="h-4 w-4" />, href: "/audit" },
        ]
      },
    ],
  },
]
