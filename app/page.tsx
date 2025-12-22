"use client"

import { ErpLayout } from "@/components/erp-layout"
import { FolderKanban, Truck, Package, DollarSign, TrendingUp, AlertCircle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { mockProjects, mockVehicles, mockInventory } from "@/lib/mock-data"
import {
  ProjectBudgetChart,
  InventoryDistributionChart,
  FleetUtilizationChart,
} from "@/components/dashboard/analytics-charts"
import { navigationConfig } from "@/lib/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { PermissionGuard } from "@/components/permission-guard"

export default function DashboardPage() {
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = mockProjects.reduce((sum, p) => sum + p.spent, 0)
  const lowStockItems = mockInventory.filter((i) => i.status === "Low Stock").length
  const vehiclesInUse = mockVehicles.filter((v) => v.status === "In Use").length

  return (
    <AuthGuard>
      <PermissionGuard module="dashboard">
        <ErpLayout navigation={navigationConfig}>
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, John. Here's what's happening today.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">This Month</Button>
                <Button variant="outline">Export Report</Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                    <p className="text-3xl font-bold">{mockProjects.filter((p) => p.status === "Active").length}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" /> +12% from last month
                    </p>
                  </div>
                  <FolderKanban className="h-8 w-8 text-accent" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Budget Utilization</p>
                    <p className="text-3xl font-bold">{Math.round((totalSpent / totalBudget) * 100)}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
                    <p className="text-3xl font-bold">{lowStockItems}</p>
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> Requires attention
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-destructive" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicles Active</p>
                    <p className="text-3xl font-bold">
                      {vehiclesInUse}/{mockVehicles.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((vehiclesInUse / mockVehicles.length) * 100)}% utilization
                    </p>
                  </div>
                  <Truck className="h-8 w-8 text-accent" />
                </div>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <ProjectBudgetChart />
              <FleetUtilizationChart />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <div className="p-6 border-b flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Active Projects</h2>
                      <p className="text-sm text-muted-foreground">Track progress and budget</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                  <div className="p-6 space-y-4">
                    {mockProjects
                      .filter((p) => p.status === "Active")
                      .map((project) => (
                        <div key={project.id} className="space-y-2 p-4 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium">{project.name}</h3>
                              <Badge variant="outline">{project.id}</Badge>
                            </div>
                            <span className="text-sm font-medium text-accent">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Budget: ${project.budget.toLocaleString()}</span>
                            <span>Spent: ${project.spent.toLocaleString()}</span>
                            <span>Remaining: ${(project.budget - project.spent).toLocaleString()}</span>
                          </div>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Due: {project.endDate}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>

              <InventoryDistributionChart />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <div className="p-6 border-b flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Low Stock Items</h2>
                    <p className="text-sm text-muted-foreground">Items requiring reorder</p>
                  </div>
                  <Badge variant="destructive">{lowStockItems}</Badge>
                </div>
                <div className="p-6 space-y-3">
                  {mockInventory
                    .filter((i) => i.status === "Low Stock")
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded border">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{item.name}</p>
                            <Badge variant="destructive" className="text-xs">
                              Low Stock
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>
                              Current: {item.quantity} {item.unit}
                            </span>
                            <span>Reorder at: {item.reorderLevel}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  <Button className="w-full bg-transparent" variant="outline">
                    Create Purchase Order
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="p-6 border-b flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Fleet Status</h2>
                    <p className="text-sm text-muted-foreground">Current vehicle operations</p>
                  </div>
                  <Badge>{vehiclesInUse} Active</Badge>
                </div>
                <div className="p-6 space-y-3">
                  {mockVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 rounded border">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{vehicle.name}</p>
                          <Badge
                            variant={
                              vehicle.status === "Available"
                                ? "outline"
                                : vehicle.status === "In Use"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {vehicle.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{vehicle.plate}</span>
                          {vehicle.driver && <span>Driver: {vehicle.driver}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-transparent" variant="outline">
                    Schedule Maintenance
                  </Button>
                </div>
              </Card>
            </div>

            <Card>
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Pending Approvals</h2>
                  <p className="text-sm text-muted-foreground">Documents awaiting your approval</p>
                </div>
                <Badge variant="secondary">5 Items</Badge>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {[
                    { id: "PO-2025-0034", type: "Purchase Order", amount: "$45,000", date: "2025-12-18" },
                    { id: "WO-PRJ-0012", type: "Work Order", amount: "$12,500", date: "2025-12-18" },
                    { id: "EXP-2025-0089", type: "Expense Claim", amount: "$3,200", date: "2025-12-17" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{item.type}</p>
                          <Badge variant="outline">{item.id}</Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Amount: {item.amount}</span>
                          <span>Date: {item.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </ErpLayout>
      </PermissionGuard>
    </AuthGuard>
  )
}
