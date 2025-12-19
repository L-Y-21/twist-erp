"use client"

import { Card } from "@/components/ui/card"
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Legend, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const projectData = [
  { month: "Jan", budget: 450000, spent: 380000 },
  { month: "Feb", budget: 520000, spent: 480000 },
  { month: "Mar", budget: 600000, spent: 520000 },
  { month: "Apr", budget: 480000, spent: 450000 },
  { month: "May", budget: 550000, spent: 520000 },
  { month: "Jun", budget: 620000, spent: 580000 },
]

const inventoryData = [
  { category: "Building Materials", value: 45 },
  { category: "Steel & Metal", value: 25 },
  { category: "Safety Equipment", value: 15 },
  { category: "Tools", value: 10 },
  { category: "Electrical", value: 5 },
]

const fleetUtilization = [
  { vehicle: "Excavators", utilization: 85 },
  { vehicle: "Mixers", utilization: 72 },
  { vehicle: "Trucks", utilization: 90 },
  { vehicle: "Cranes", utilization: 65 },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function ProjectBudgetChart() {
  return (
    <Card>
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Project Budget vs Spending</h3>
        <p className="text-sm text-muted-foreground">Monthly comparison</p>
      </div>
      <div className="p-6">
        <ChartContainer
          config={{
            budget: { label: "Budget", color: "hsl(var(--chart-1))" },
            spent: { label: "Spent", color: "hsl(var(--chart-2))" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="budget" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  )
}

export function InventoryDistributionChart() {
  return (
    <Card>
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Inventory Distribution</h3>
        <p className="text-sm text-muted-foreground">By category</p>
      </div>
      <div className="p-6">
        <ChartContainer
          config={{
            value: { label: "Percentage", color: "hsl(var(--chart-1))" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={inventoryData} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  )
}

export function FleetUtilizationChart() {
  return (
    <Card>
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Fleet Utilization</h3>
        <p className="text-sm text-muted-foreground">Current week average</p>
      </div>
      <div className="p-6">
        <ChartContainer
          config={{
            utilization: { label: "Utilization %", color: "hsl(var(--chart-1))" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fleetUtilization} layout="vertical">
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="vehicle" type="category" width={100} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="utilization" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  )
}
