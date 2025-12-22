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
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

export default function DashboardPage() {
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = mockProjects.reduce((sum, p) => sum + p.spent, 0)
  const lowStockItems = mockInventory.filter((i) => i.status === "Low Stock").length
  const vehiclesInUse = mockVehicles.filter((v) => v.status === "In Use").length

  return (
    <AuthGuard>
      <PermissionGuard module="dashboard">
        <ErpLayout navigation={navigationConfig}>
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-balance">
                  Dashboard <span className="text-primary">Overview</span>
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                  Welcome back, <span className="text-foreground font-bold">John</span>. Here's your business at a glance.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-xl px-5 h-11 border-2 hover:bg-primary/5 transition-all">
                  <Clock className="mr-2 h-4 w-4" /> This Month
                </Button>
                <Button className="rounded-xl px-5 h-11 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  Export Report
                </Button>
              </div>
            </div>

            {/* KPI Cards - Rearranged and Styled */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6 rounded-3xl border-none shadow-premium bg-gradient-to-br from-card to-primary/5 group hover:scale-[1.02] transition-all duration-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Active Projects</p>
                    <p className="text-4xl font-black tracking-tighter">{mockProjects.filter((p) => p.status === "Active").length}</p>
                    <div className="flex items-center gap-1.5 mt-3 px-2 py-1 bg-green-500/10 text-green-600 rounded-full w-fit">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-[10px] font-bold">+12%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <FolderKanban className="h-6 w-6" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-3xl border-none shadow-premium bg-gradient-to-br from-card to-accent/5 group hover:scale-[1.02] transition-all duration-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Budget Utilization</p>
                    <p className="text-4xl font-black tracking-tighter">{Math.round((totalSpent / totalBudget) * 100)}%</p>
                    <p className="text-[10px] font-bold text-muted-foreground mt-3">
                      ${(totalSpent / 1000).toFixed(1)}k <span className="text-muted-foreground/40 mx-1">/</span> ${(totalBudget / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-2xl text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-3xl border-none shadow-premium bg-gradient-to-br from-card to-destructive/5 group hover:scale-[1.02] transition-all duration-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Low Stock Alerts</p>
                    <p className="text-4xl font-black tracking-tighter text-destructive">{lowStockItems}</p>
                    <div className="flex items-center gap-1.5 mt-3 px-2 py-1 bg-destructive/10 text-destructive rounded-full w-fit">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-[10px] font-bold">Action Required</span>
                    </div>
                  </div>
                  <div className="p-3 bg-destructive/10 rounded-2xl text-destructive group-hover:bg-destructive group-hover:text-white transition-all duration-500">
                    <Package className="h-6 w-6" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-3xl border-none shadow-premium bg-gradient-to-br from-card to-primary/5 group hover:scale-[1.02] transition-all duration-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Fleet Utilization</p>
                    <p className="text-4xl font-black tracking-tighter">{Math.round((vehiclesInUse / mockVehicles.length) * 100)}%</p>
                    <p className="text-[10px] font-bold text-muted-foreground mt-3 uppercase tracking-tighter">
                      {vehiclesInUse} of {mockVehicles.length} Active
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Truck className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="p-1 rounded-[2rem] bg-gradient-to-br from-primary/20 to-transparent shadow-premium">
                <ProjectBudgetChart />
              </div>
              <div className="p-1 rounded-[2rem] bg-gradient-to-br from-accent/20 to-transparent shadow-premium">
                <FleetUtilizationChart />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Active Projects List */}
              <div className="lg:col-span-2">
                <Card className="rounded-[2rem] border-none shadow-premium overflow-hidden">
                  <div className="p-8 border-b border-border/50 flex items-center justify-between bg-muted/20">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Active Projects</h2>
                      <p className="text-sm text-muted-foreground font-medium">Real-time progress tracking</p>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-xl font-bold text-primary hover:bg-primary/5">
                      View All Projects
                    </Button>
                  </div>
                  <div className="p-8 space-y-6">
                    {mockProjects
                      .filter((p) => p.status === "Active")
                      .map((project) => (
                        <div key={project.id} className="group space-y-4 p-6 rounded-3xl border-2 border-transparent hover:border-primary/10 hover:bg-primary/[0.02] transition-all duration-500">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                                {project.name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg leading-none">{project.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1 font-bold uppercase tracking-widest">{project.id}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-black text-primary">{project.progress}%</span>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Complete</p>
                            </div>
                          </div>
                          <Progress value={project.progress} className="h-3 rounded-full bg-muted/50" />
                          <div className="grid grid-cols-3 gap-4 pt-2">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Budget</p>
                              <p className="text-sm font-black">${project.budget.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Spent</p>
                              <p className="text-sm font-black text-accent">${project.spent.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Due Date</p>
                              <p className="text-sm font-black flex items-center gap-1.5">
                                <Clock className="h-3 w-3 text-primary" /> {project.endDate}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>

              {/* Inventory Distribution */}
              <div className="space-y-8">
                <div className="p-1 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent shadow-premium">
                  <InventoryDistributionChart />
                </div>

                <Card className="rounded-[2rem] border-none shadow-premium overflow-hidden">
                  <div className="p-6 border-b border-border/50 flex items-center justify-between bg-destructive/5">
                    <div>
                      <h2 className="text-lg font-black tracking-tight">Low Stock</h2>
                      <p className="text-xs text-muted-foreground font-medium">Reorder required</p>
                    </div>
                    <Badge variant="destructive" className="rounded-full px-3 py-1 font-black">{lowStockItems}</Badge>
                  </div>
                  <div className="p-6 space-y-4">
                    {mockInventory
                      .filter((i) => i.status === "Low Stock")
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:border-destructive/10 hover:bg-destructive/[0.02] transition-all">
                          <div className="flex-1">
                            <p className="font-bold text-sm">{item.name}</p>
                            <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest">
                              <span>Stock: {item.quantity} {item.unit}</span>
                              <span className="text-destructive">Min: {item.reorderLevel}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    <Button className="w-full h-11 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-none font-bold transition-all">
                      Create Purchase Order
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Fleet & Approvals Grid */}
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="rounded-[2rem] border-none shadow-premium overflow-hidden">
                <div className="p-8 border-b border-border/50 flex items-center justify-between bg-muted/20">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">Fleet Status</h2>
                    <p className="text-sm text-muted-foreground font-medium">Live vehicle operations</p>
                  </div>
                  <Badge className="rounded-full px-4 py-1.5 font-black bg-primary/10 text-primary border-none">{vehiclesInUse} Active</Badge>
                </div>
                <div className="p-8 space-y-4">
                  {mockVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-5 rounded-3xl border-2 border-transparent hover:border-primary/10 hover:bg-primary/[0.02] transition-all">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-lg">{vehicle.name}</p>
                          <Badge
                            className={cn(
                              "rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-widest border-none",
                              vehicle.status === "Available"
                                ? "bg-green-500/10 text-green-600"
                                : vehicle.status === "In Use"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-destructive/10 text-destructive"
                            )}
                          >
                            {vehicle.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground font-medium">
                          <span className="font-bold">{vehicle.plate}</span>
                          {vehicle.driver && <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {vehicle.driver}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full h-12 rounded-2xl bg-muted/50 hover:bg-primary/10 hover:text-primary font-bold transition-all mt-4">
                    Schedule Maintenance
                  </Button>
                </div>
              </Card>

              <Card className="rounded-[2rem] border-none shadow-premium overflow-hidden">
                <div className="p-8 border-b border-border/50 flex items-center justify-between bg-primary/5">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">Pending Approvals</h2>
                    <p className="text-sm text-muted-foreground font-medium">Action required on documents</p>
                  </div>
                  <Badge variant="secondary" className="rounded-full px-4 py-1.5 font-black">5 Items</Badge>
                </div>
                <div className="p-8 space-y-4">
                  {[
                    { id: "PO-2025-0034", type: "Purchase Order", amount: "$45,000", date: "2025-12-18" },
                    { id: "WO-PRJ-0012", type: "Work Order", amount: "$12,500", date: "2025-12-18" },
                    { id: "EXP-2025-0089", type: "Expense Claim", amount: "$3,200", date: "2025-12-17" },
                  ].map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl border-2 border-transparent hover:border-primary/10 hover:bg-primary/[0.02] transition-all gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-bold text-lg">{item.type}</p>
                          <Badge variant="outline" className="rounded-lg font-bold text-[10px] uppercase tracking-widest">{item.id}</Badge>
                        </div>
                        <div className="flex gap-6 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1.5"><DollarSign className="h-3 w-3 text-primary" /> {item.amount}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-primary" /> {item.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-xl px-4 font-bold border-2 hover:bg-primary/5">
                          Review
                        </Button>
                        <Button size="sm" className="rounded-xl px-4 font-bold shadow-md shadow-primary/10">
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full mt-4 font-bold text-primary hover:bg-primary/5 rounded-xl">View All Pending Approvals</Button>
                </div>
              </Card>
            </div>
          </div>
        </ErpLayout>
      </PermissionGuard>
    </AuthGuard>
  )
}
