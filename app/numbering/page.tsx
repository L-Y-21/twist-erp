"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Plus } from "lucide-react"
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

const documentTypes = [
  { type: "Project Order", prefix: "PO", format: "PO-{YEAR}-{NUMBER}", current: 34 },
  { type: "Work Order", prefix: "WO", format: "WO-{YEAR}-{NUMBER}", current: 56 },
  { type: "Fuel Log", prefix: "FL", format: "FL-{YEAR}-{NUMBER}", current: 12 },
  { type: "Stock In", prefix: "SM-IN", format: "SM-IN-{YEAR}-{NUMBER}", current: 45 },
  { type: "Stock Out", prefix: "SM-OUT", format: "SM-OUT-{YEAR}-{NUMBER}", current: 89 },
  { type: "Invoice", prefix: "INV", format: "INV-{YEAR}-{NUMBER}", current: 234 },
]

export default function DocumentNumberingPage() {
  return (
    <ErpLayout navigation={navigation}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Document Numbering</h1>
            <p className="text-muted-foreground">Configure automatic numbering for documents and vouchers</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Document Type
          </Button>
        </div>

        <div className="grid gap-4">
          {documentTypes.map((doc) => (
            <Card key={doc.type} className="p-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{doc.type}</h3>
                    <p className="text-sm text-muted-foreground">Current number: {doc.current}</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Prefix</Label>
                    <Input defaultValue={doc.prefix} />
                  </div>

                  <div className="space-y-2">
                    <Label>Number Format</Label>
                    <Select defaultValue={doc.format}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PO-{YEAR}-{NUMBER}">{doc.prefix}-YYYY-####</SelectItem>
                        <SelectItem value="PO-{NUMBER}">{doc.prefix}-####</SelectItem>
                        <SelectItem value="PO-{YEAR}{MONTH}-{NUMBER}">{doc.prefix}-YYYYMM-####</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Next Number</Label>
                    <Input type="number" defaultValue={doc.current + 1} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Preview</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {doc.prefix}-2025-{String(doc.current + 1).padStart(4, "0")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Select defaultValue="yearly">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yearly">Reset Yearly</SelectItem>
                        <SelectItem value="monthly">Reset Monthly</SelectItem>
                        <SelectItem value="never">Never Reset</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>
    </ErpLayout>
  )
}
