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

interface StockMovement {
  id: string
  voucherNumber: string
  type: "Stock In" | "Stock Out" | "Transfer"
  date: string
  items: number
  project?: string
  status: "Draft" | "Submitted" | "Approved"
}

const mockMovements: StockMovement[] = [
  {
    id: "1",
    voucherNumber: "SM-IN-2025-0045",
    type: "Stock In",
    date: "2025-12-18",
    items: 3,
    status: "Approved",
  },
  {
    id: "2",
    voucherNumber: "SM-OUT-2025-0089",
    type: "Stock Out",
    date: "2025-12-17",
    items: 5,
    project: "Downtown Tower",
    status: "Approved",
  },
  {
    id: "3",
    voucherNumber: "SM-TR-2025-0023",
    type: "Transfer",
    date: "2025-12-16",
    items: 2,
    project: "Bridge Renovation",
    status: "Submitted",
  },
]

const columns: ColumnDef<StockMovement>[] = [
  {
    accessorKey: "voucherNumber",
    header: ({ column }) => <SortableHeader column={column}>Voucher #</SortableHeader>,
    cell: ({ row }) => <span className="font-medium">{row.getValue("voucherNumber")}</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <Badge variant={type === "Stock In" ? "default" : type === "Stock Out" ? "secondary" : "outline"}>{type}</Badge>
      )
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => <span>{row.getValue("items")} items</span>,
  },
  {
    accessorKey: "project",
    header: "Project/Location",
    cell: ({ row }) => {
      const project = row.getValue("project") as string | undefined
      return project ? <span>{project}</span> : <span className="text-muted-foreground">-</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "Approved" ? "default" : status === "Submitted" ? "secondary" : "outline"}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/stock-movements/${row.original.id}`}>
        <Button size="sm" variant="ghost">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </Link>
    ),
  },
]

export default function StockMovementsPage() {
  return (
    <ErpLayout navigation={navigation}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Stock Movements</h1>
            <p className="text-muted-foreground">Track inventory transactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Stock In</Button>
            <Button variant="outline">Stock Out</Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Transfer
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Stock In</div>
            <div className="text-2xl font-bold text-green-600">
              {mockMovements.filter((m) => m.type === "Stock In").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Stock Out</div>
            <div className="text-2xl font-bold text-red-600">
              {mockMovements.filter((m) => m.type === "Stock Out").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Transfers</div>
            <div className="text-2xl font-bold">{mockMovements.filter((m) => m.type === "Transfer").length}</div>
          </Card>
        </div>

        <Card className="p-6">
          <DataTable
            columns={columns}
            data={mockMovements}
            searchKey="voucherNumber"
            searchPlaceholder="Search movements..."
          />
        </Card>
      </div>
    </ErpLayout>
  )
}
