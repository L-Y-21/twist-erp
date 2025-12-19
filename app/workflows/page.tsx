"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit } from "lucide-react"
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

const workflows = [
  {
    name: "Project Order Approval",
    documentType: "Project Order",
    levels: 2,
    condition: "Amount > $10,000",
    approvers: ["Manager", "Director"],
    active: true,
  },
  {
    name: "Work Order Approval",
    documentType: "Work Order",
    levels: 1,
    condition: "Amount > $5,000",
    approvers: ["Maintenance Manager"],
    active: true,
  },
  {
    name: "Expense Claim Approval",
    documentType: "Expense",
    levels: 2,
    condition: "Amount > $1,000",
    approvers: ["Manager", "Accountant"],
    active: true,
  },
  {
    name: "Stock Transfer Approval",
    documentType: "Stock Transfer",
    levels: 1,
    condition: "All transfers",
    approvers: ["Warehouse Manager"],
    active: false,
  },
]

export default function WorkflowsPage() {
  return (
    <ErpLayout navigation={navigation}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Approval Workflows</h1>
            <p className="text-muted-foreground">Configure multi-level approval processes</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Workflows</div>
            <div className="text-2xl font-bold">{workflows.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-accent">{workflows.filter((w) => w.active).length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Document Types</div>
            <div className="text-2xl font-bold">{new Set(workflows.map((w) => w.documentType)).size}</div>
          </Card>
        </div>

        <div className="grid gap-4">
          {workflows.map((workflow, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{workflow.name}</h3>
                    <Badge variant={workflow.active ? "default" : "secondary"}>
                      {workflow.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Document Type: {workflow.documentType}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Approval Levels</p>
                  <p className="text-2xl font-bold text-accent">{workflow.levels}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Condition</p>
                  <Badge variant="outline">{workflow.condition}</Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Approvers</p>
                  <div className="flex flex-wrap gap-1">
                    {workflow.approvers.map((approver, idx) => (
                      <Badge key={idx} variant="secondary">
                        {approver}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Workflow Steps</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-medium">
                      1
                    </div>
                    <span>Submitted</span>
                  </div>
                  <div className="h-px flex-1 bg-border" />
                  {workflow.approvers.map((approver, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-medium">
                          {idx + 2}
                        </div>
                        <span>{approver}</span>
                      </div>
                      {idx < workflow.approvers.length - 1 && <div className="h-px w-8 bg-border" />}
                    </div>
                  ))}
                  <div className="h-px flex-1 bg-border" />
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-medium">
                      ✓
                    </div>
                    <span>Approved</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </ErpLayout>
  )
}
