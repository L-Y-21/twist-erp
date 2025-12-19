"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, X } from "lucide-react"
import Link from "next/link"
import { VoucherTemplate } from "@/components/voucher-template"
import { navigationConfig } from "@/lib/navigation"
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Truck,
  Package,
  Building2,
  Wrench,
  UserSquare2,
  DollarSign,
  Settings,
} from "lucide-react"

const navigation = [
  { title: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, href: "/" },
  {
    title: "User Management",
    icon: <Users className="h-4 w-4" />,
    children: [
      { title: "Users", icon: <Users className="h-4 w-4" />, href: "/users" },
      { title: "Roles & Permissions", icon: <Users className="h-4 w-4" />, href: "/roles" },
      { title: "Audit Logs", icon: <Users className="h-4 w-4" />, href: "/audit" },
    ],
  },
  {
    title: "Project Management",
    icon: <FolderKanban className="h-4 w-4" />,
    children: [
      { title: "Projects", icon: <FolderKanban className="h-4 w-4" />, href: "/projects" },
      { title: "Tasks", icon: <FolderKanban className="h-4 w-4" />, href: "/tasks" },
      { title: "Project Orders", icon: <FolderKanban className="h-4 w-4" />, href: "/project-orders" },
    ],
  },
  {
    title: "Fleet Management",
    icon: <Truck className="h-4 w-4" />,
    children: [
      { title: "Vehicles", icon: <Truck className="h-4 w-4" />, href: "/vehicles" },
      { title: "Drivers", icon: <Truck className="h-4 w-4" />, href: "/drivers" },
      { title: "Fuel Logs", icon: <Truck className="h-4 w-4" />, href: "/fuel-logs" },
      { title: "Trip Orders", icon: <Truck className="h-4 w-4" />, href: "/trip-orders" },
    ],
  },
  {
    title: "Inventory",
    icon: <Package className="h-4 w-4" />,
    children: [
      { title: "Items", icon: <Package className="h-4 w-4" />, href: "/items" },
      { title: "Categories", icon: <Package className="h-4 w-4" />, href: "/categories" },
      { title: "Stock Movements", icon: <Package className="h-4 w-4" />, href: "/stock-movements" },
    ],
  },
  {
    title: "Property",
    icon: <Building2 className="h-4 w-4" />,
    children: [
      { title: "Properties", icon: <Building2 className="h-4 w-4" />, href: "/properties" },
      { title: "Units", icon: <Building2 className="h-4 w-4" />, href: "/units" },
      { title: "Lease Orders", icon: <Building2 className="h-4 w-4" />, href: "/leases" },
    ],
  },
  {
    title: "Service & Maintenance",
    icon: <Wrench className="h-4 w-4" />,
    children: [
      { title: "Service Requests", icon: <Wrench className="h-4 w-4" />, href: "/service-requests" },
      { title: "Work Orders", icon: <Wrench className="h-4 w-4" />, href: "/work-orders" },
      { title: "Preventive Maintenance", icon: <Wrench className="h-4 w-4" />, href: "/preventive" },
    ],
  },
  {
    title: "HR Management",
    icon: <UserSquare2 className="h-4 w-4" />,
    children: [
      { title: "Employees", icon: <UserSquare2 className="h-4 w-4" />, href: "/employees" },
      { title: "Attendance", icon: <UserSquare2 className="h-4 w-4" />, href: "/attendance" },
      { title: "Leave Management", icon: <UserSquare2 className="h-4 w-4" />, href: "/leaves" },
    ],
  },
  {
    title: "Finance",
    icon: <DollarSign className="h-4 w-4" />,
    children: [
      { title: "Invoices", icon: <DollarSign className="h-4 w-4" />, href: "/invoices" },
      { title: "Expenses", icon: <DollarSign className="h-4 w-4" />, href: "/expenses" },
      { title: "Payment Vouchers", icon: <DollarSign className="h-4 w-4" />, href: "/payments" },
    ],
  },
  {
    title: "System Settings",
    icon: <Settings className="h-4 w-4" />,
    children: [
      { title: "Company Profile", icon: <Settings className="h-4 w-4" />, href: "/company" },
      { title: "Document Numbering", icon: <Settings className="h-4 w-4" />, href: "/numbering" },
      { title: "Approval Workflows", icon: <Settings className="h-4 w-4" />, href: "/workflows" },
    ],
  },
]

export default function ProjectOrderDetailPage() {
  const orderItems = [
    { description: "Portland Cement Grade 52.5", quantity: 200, unit: "Bags", unitPrice: 45.0, tax: 90.0, total: 9090 },
    { description: "Steel Rebar 12mm", quantity: 500, unit: "Pieces", unitPrice: 15.0, tax: 75.0, total: 7575 },
    {
      description: "Concrete Mixer Rental",
      quantity: 1,
      unit: "Month",
      unitPrice: 2500.0,
      tax: 250.0,
      total: 2750,
    },
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = orderItems.reduce((sum, item) => sum + (item.tax || 0), 0)
  const total = subtotal + tax

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/project-orders">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Project Order Details</h1>
              <p className="text-muted-foreground">PO-2025-0034</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button>
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>

        <VoucherTemplate
          documentType="PROJECT ORDER"
          documentNumber="PO-2025-0034"
          documentDate="2025-12-15"
          status="Submitted"
          items={orderItems}
          subtotal={subtotal}
          tax={tax}
          total={total}
          notes="All materials to be delivered to Downtown Tower Construction site by January 5, 2025. Contact site manager for delivery schedule."
          preparedBy="Sarah Manager"
          watermark="PENDING"
        />
      </div>
    </ErpLayout>
  )
}
