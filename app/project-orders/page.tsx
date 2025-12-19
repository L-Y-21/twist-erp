"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, Eye } from "lucide-react"
import { DataTable, SortableHeader } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
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

interface ProjectOrder {
  id: string
  orderNumber: string
  projectName: string
  orderDate: string
  totalAmount: number
  status: "Draft" | "Submitted" | "Approved" | "Rejected"
}

const mockOrders: ProjectOrder[] = [
  {
    id: "1",
    orderNumber: "PO-2025-0034",
    projectName: "Downtown Tower Construction",
    orderDate: "2025-12-15",
    totalAmount: 45000,
    status: "Submitted",
  },
  {
    id: "2",
    orderNumber: "PO-2025-0033",
    projectName: "Highway Bridge Renovation",
    orderDate: "2025-12-10",
    totalAmount: 28500,
    status: "Approved",
  },
  {
    id: "3",
    orderNumber: "PO-2025-0032",
    projectName: "Shopping Mall Development",
    orderDate: "2025-12-08",
    totalAmount: 67200,
    status: "Draft",
  },
]

const columns: ColumnDef<ProjectOrder>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => <SortableHeader column={column}>Order Number</SortableHeader>,
    cell: ({ row }) => <span className="font-medium">{row.getValue("orderNumber")}</span>,
  },
  {
    accessorKey: "projectName",
    header: ({ column }) => <SortableHeader column={column}>Project</SortableHeader>,
  },
  {
    accessorKey: "orderDate",
    header: ({ column }) => <SortableHeader column={column}>Order Date</SortableHeader>,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => <SortableHeader column={column}>Total Amount</SortableHeader>,
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number
      return <span>${amount.toLocaleString()}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "Approved"
              ? "default"
              : status === "Submitted"
                ? "secondary"
                : status === "Rejected"
                  ? "destructive"
                  : "outline"
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/project-orders/${row.original.id}`}>
          <Button size="sm" variant="ghost">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </Link>
        <Button size="sm" variant="ghost">
          Edit
        </Button>
      </div>
    ),
  },
]

export default function ProjectOrdersPage() {
  return (
    <ErpLayout navigation={navigation}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Project Orders</h1>
            <p className="text-muted-foreground">Manage project purchase orders and requisitions</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Orders</div>
            <div className="text-2xl font-bold">{mockOrders.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Pending Approval</div>
            <div className="text-2xl font-bold text-accent">
              {mockOrders.filter((o) => o.status === "Submitted").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold">
              ${mockOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Approved This Month</div>
            <div className="text-2xl font-bold">{mockOrders.filter((o) => o.status === "Approved").length}</div>
          </Card>
        </div>

        <Card className="p-6">
          <DataTable columns={columns} data={mockOrders} searchKey="orderNumber" searchPlaceholder="Search orders..." />
        </Card>
      </div>
    </ErpLayout>
  )
}
