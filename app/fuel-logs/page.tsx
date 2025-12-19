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

interface FuelLog {
  id: string
  voucherNumber: string
  vehicle: string
  date: string
  quantity: number
  pricePerLiter: number
  totalCost: number
  driver: string
  status: "Draft" | "Submitted" | "Approved"
}

const mockFuelLogs: FuelLog[] = [
  {
    id: "1",
    voucherNumber: "FL-2025-0012",
    vehicle: "CAT-001",
    date: "2025-12-18",
    quantity: 250,
    pricePerLiter: 1.5,
    totalCost: 375,
    driver: "Mike Tech",
    status: "Approved",
  },
  {
    id: "2",
    voucherNumber: "FL-2025-0011",
    vehicle: "MIX-001",
    date: "2025-12-17",
    quantity: 180,
    pricePerLiter: 1.5,
    totalCost: 270,
    driver: "John Driver",
    status: "Submitted",
  },
  {
    id: "3",
    voucherNumber: "FL-2025-0010",
    vehicle: "TRK-001",
    date: "2025-12-16",
    quantity: 75,
    pricePerLiter: 1.5,
    totalCost: 112.5,
    driver: "Sarah Transport",
    status: "Approved",
  },
]

const columns: ColumnDef<FuelLog>[] = [
  {
    accessorKey: "voucherNumber",
    header: ({ column }) => <SortableHeader column={column}>Voucher #</SortableHeader>,
    cell: ({ row }) => <span className="font-medium">{row.getValue("voucherNumber")}</span>,
  },
  {
    accessorKey: "vehicle",
    header: "Vehicle",
    cell: ({ row }) => <span className="font-mono">{row.getValue("vehicle")}</span>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortableHeader column={column}>Quantity (L)</SortableHeader>,
  },
  {
    accessorKey: "pricePerLiter",
    header: "Price/L",
    cell: ({ row }) => {
      const price = row.getValue("pricePerLiter") as number
      return <span>${price.toFixed(2)}</span>
    },
  },
  {
    accessorKey: "totalCost",
    header: ({ column }) => <SortableHeader column={column}>Total Cost</SortableHeader>,
    cell: ({ row }) => {
      const cost = row.getValue("totalCost") as number
      return <span className="font-medium">${cost.toFixed(2)}</span>
    },
  },
  {
    accessorKey: "driver",
    header: "Driver",
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
      <Link href={`/fuel-logs/${row.original.id}`}>
        <Button size="sm" variant="ghost">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </Link>
    ),
  },
]

export default function FuelLogsPage() {
  const totalCost = mockFuelLogs.reduce((sum, log) => sum + log.totalCost, 0)
  const totalQuantity = mockFuelLogs.reduce((sum, log) => sum + log.quantity, 0)

  return (
    <ErpLayout navigation={navigation}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Fuel Logs</h1>
            <p className="text-muted-foreground">Track fuel consumption and expenses</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Fuel Log
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Logs</div>
            <div className="text-2xl font-bold">{mockFuelLogs.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Quantity</div>
            <div className="text-2xl font-bold">{totalQuantity}L</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Cost</div>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Avg Price/L</div>
            <div className="text-2xl font-bold">${(totalCost / totalQuantity).toFixed(2)}</div>
          </Card>
        </div>

        <Card className="p-6">
          <DataTable
            columns={columns}
            data={mockFuelLogs}
            searchKey="voucherNumber"
            searchPlaceholder="Search fuel logs..."
          />
        </Card>
      </div>
    </ErpLayout>
  )
}
