"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, Eye, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Package } from "lucide-react"
import { DataTable, SortableHeader } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { navigationConfig } from "@/lib/navigation"
import { cn } from "@/lib/utils"


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
    header: ({ column }: { column: any }) => <SortableHeader column={column}>Voucher #</SortableHeader>,
    cell: ({ row }: { row: any }) => <span className="font-medium">{row.getValue("voucherNumber")}</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }: { row: any }) => {
      const type = row.getValue("type") as string
      return (
        <Badge variant={type === "Stock In" ? "default" : type === "Stock Out" ? "secondary" : "outline"}>{type}</Badge>
      )
    },
  },
  {
    accessorKey: "date",
    header: ({ column }: { column: any }) => <SortableHeader column={column}>Date</SortableHeader>,
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }: { row: any }) => <span>{row.getValue("items")} items</span>,
  },
  {
    accessorKey: "project",
    header: "Project/Location",
    cell: ({ row }: { row: any }) => {
      const project = row.getValue("project") as string | undefined
      return project ? <span>{project}</span> : <span className="text-muted-foreground">-</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: any }) => {
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
    cell: ({ row }: { row: any }) => (
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
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Stock <span className="text-primary">Movements</span></h1>
            <p className="text-muted-foreground mt-1">Track and manage all inventory transactions and transfers</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-glass border-glass hover:bg-white/5 rounded-xl">
              <ArrowDownLeft className="h-4 w-4 mr-2 text-emerald-400" />
              Stock In
            </Button>
            <Button variant="outline" className="bg-glass border-glass hover:bg-white/5 rounded-xl">
              <ArrowUpRight className="h-4 w-4 mr-2 text-rose-400" />
              Stock Out
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] rounded-xl px-6">
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Transfer
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Stock In", value: mockMovements.filter((m) => m.type === "Stock In").length, icon: <ArrowDownLeft className="h-5 w-5" />, color: "text-emerald-600" },
            { label: "Stock Out", value: mockMovements.filter((m) => m.type === "Stock Out").length, icon: <ArrowUpRight className="h-5 w-5" />, color: "text-rose-600" },
            { label: "Transfers", value: mockMovements.filter((m) => m.type === "Transfer").length, icon: <ArrowLeftRight className="h-5 w-5" />, color: "text-blue-600" },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 bg-glass border-glass relative overflow-hidden group hover:border-primary/30 transition-all duration-500 rounded-3xl">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                {stat.icon}
              </div>
              <div className="relative z-10">
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-sidebar-foreground/40 mb-2">{stat.label}</div>
                <div className={cn("text-3xl font-black tracking-tight", stat.color)}>{stat.value}</div>
              </div>
            </Card>
          ))}
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
