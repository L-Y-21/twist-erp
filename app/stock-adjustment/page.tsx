"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CrudModal } from "@/components/crud-modal"
import { DeleteDialog } from "@/components/delete-dialog"
import { ViewSwitcher } from "@/components/view-switcher"
import { GridCard } from "@/components/grid-card"
import { DataTable, SortableHeader } from "@/components/data-table"
import { Plus, Edit, Trash2, Eye, RefreshCcw, AlertTriangle, CheckCircle, DollarSign } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { formatCurrency, cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormFieldWrapper } from "@/components/form-field-wrapper"

interface StockAdjustment {
  id: string
  adjustmentNo: string
  date: string
  store: string
  reason: string
  items: number
  adjustmentValue: number
  adjustedBy: string
  status: "Draft" | "Approved"
}

const mockAdjustments: StockAdjustment[] = [
  {
    id: "1",
    adjustmentNo: "ADJ-2025-0001",
    date: "2025-12-19",
    store: "Main Warehouse",
    reason: "Physical count discrepancy",
    items: 4,
    adjustmentValue: -2500,
    adjustedBy: "Lisa Anderson",
    status: "Approved",
  },
  {
    id: "2",
    adjustmentNo: "ADJ-2025-0002",
    date: "2025-12-18",
    store: "Site Store - Tower",
    reason: "Damaged items write-off",
    items: 2,
    adjustmentValue: -1200,
    adjustedBy: "Tom Wilson",
    status: "Draft",
  },
]

export default function StockAdjustmentPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(mockAdjustments)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAdjustment, setEditingAdjustment] = useState<StockAdjustment | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adjustmentToDelete, setAdjustmentToDelete] = useState<string | null>(null)

  const handleSave = (data: any) => {
    if (editingAdjustment) {
      setAdjustments(adjustments.map((a) => (a.id === editingAdjustment.id ? { ...a, ...data } : a)))
      toast({ title: "Adjustment Updated", description: "Record has been updated successfully." })
    } else {
      const newAdjustment: StockAdjustment = {
        id: Date.now().toString(),
        adjustmentNo: `ADJ-2025-${String(adjustments.length + 1).padStart(4, "0")}`,
        ...data,
      }
      setAdjustments([...adjustments, newAdjustment])
      toast({ title: "Adjustment Created", description: "New record has been created successfully." })
    }
    setIsModalOpen(false)
    setEditingAdjustment(null)
  }

  const handleEdit = (adjustment: StockAdjustment) => {
    setEditingAdjustment(adjustment)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setAdjustments(adjustments.filter((a) => a.id !== id))
    toast({ title: "Record Deleted", description: "Adjustment has been deleted successfully." })
  }

  const columns: ColumnDef<StockAdjustment>[] = [
    {
      accessorKey: "adjustmentNo",
      header: ({ column }) => <SortableHeader column={column}>Adjustment #</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("adjustmentNo")}</span>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
    },
    {
      accessorKey: "store",
      header: "Store",
    },
    {
      accessorKey: "reason",
      header: "Reason",
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => <span>{row.getValue("items")} items</span>,
    },
    {
      accessorKey: "adjustmentValue",
      header: "Adjustment Value",
      cell: ({ row }) => {
        const value = row.getValue("adjustmentValue") as number
        return (
          <span className={value < 0 ? "text-red-600" : "text-green-600"}>
            {value < 0 ? "-" : "+"}
            {formatCurrency(Math.abs(value))}
          </span>
        )
      },
    },
    {
      accessorKey: "adjustedBy",
      header: "Adjusted By",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <Badge variant={status === "Approved" ? "default" : "outline"}>{status}</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => router.push(`/stock-adjustment/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setAdjustmentToDelete(row.original.id)
              setDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const formFields = [
    { name: "date", label: "Date", type: "date" as const, required: true },
    { name: "store", label: "Store", type: "text" as const, required: true },
    { name: "reason", label: "Reason", type: "text" as const, required: true },
    { name: "items", label: "Number of Items", type: "number" as const, required: true },
    { name: "adjustmentValue", label: "Adjustment Value", type: "number" as const, required: true },
    { name: "adjustedBy", label: "Adjusted By", type: "text" as const, required: true },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      options: ["Draft", "Approved"],
      required: true,
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Stock <span className="text-primary">Adjustment</span></h1>
            <p className="text-muted-foreground mt-1">Adjust stock levels for discrepancies and write-offs</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button
              onClick={() => {
                setEditingAdjustment(null)
                setIsModalOpen(true)
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] rounded-xl px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Adjustment
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Adjustments", value: adjustments.length, icon: <RefreshCcw className="h-5 w-5" />, color: "text-blue-600" },
            { label: "Total Value", value: formatCurrency(Math.abs(adjustments.reduce((sum, a) => sum + a.adjustmentValue, 0))), icon: <DollarSign className="h-5 w-5" />, color: "text-red-600" },
            { label: "Pending Approval", value: adjustments.filter((a) => a.status === "Draft").length, icon: <AlertTriangle className="h-5 w-5" />, color: "text-amber-600" },
            { label: "Approved", value: adjustments.filter((a) => a.status === "Approved").length, icon: <CheckCircle className="h-5 w-5" />, color: "text-emerald-600" },
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

        {viewMode === "table" ? (
          <Card className="p-6">
            <DataTable columns={columns} data={adjustments} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {adjustments.map((adjustment) => (
              <GridCard
                key={adjustment.id}
                title={adjustment.adjustmentNo}
                subtitle={adjustment.store}
                badges={[{ label: adjustment.status, variant: adjustment.status === "Approved" ? "default" : "outline" }]}
                metadata={[
                  { icon: RefreshCcw, label: adjustment.reason },
                  { icon: CheckCircle, label: `${adjustment.items} items` },
                  { icon: DollarSign, label: `${adjustment.adjustmentValue < 0 ? "-" : "+"}${formatCurrency(Math.abs(adjustment.adjustmentValue))}` },
                ]}
                onView={() => router.push(`/stock-adjustment/${adjustment.id}`)}
                onEdit={() => handleEdit(adjustment)}
                onDelete={() => {
                  setAdjustmentToDelete(adjustment.id)
                  setDeleteDialogOpen(true)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <CrudModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setEditingAdjustment(null)
        }}
        onSubmit={() => handleSave({})}
        title={editingAdjustment ? "Edit Stock Adjustment" : "New Stock Adjustment"}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormFieldWrapper label="Date" required>
            <Input type="date" defaultValue={editingAdjustment?.date} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Store" required>
            <Input defaultValue={editingAdjustment?.store} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Reason" required>
            <Input defaultValue={editingAdjustment?.reason} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Items" required>
            <Input type="number" defaultValue={editingAdjustment?.items} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Adjustment Value" required>
            <Input type="number" defaultValue={editingAdjustment?.adjustmentValue} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Adjusted By" required>
            <Input defaultValue={editingAdjustment?.adjustedBy} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Status" required>
            <Select defaultValue={editingAdjustment?.status || "Draft"}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        </div>
      </CrudModal>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (adjustmentToDelete) handleDelete(adjustmentToDelete)
          setDeleteDialogOpen(false)
        }}
        title="Delete Stock Adjustment"
        description="Are you sure you want to delete this adjustment? This action cannot be undone."
      />
    </ErpLayout>
  )
}
