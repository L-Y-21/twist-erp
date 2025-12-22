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
import { Plus, Edit, Trash2, Eye, Package, FileText, AlertCircle } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { formatCurrency, cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormFieldWrapper } from "@/components/form-field-wrapper"

interface GoodsReceiving {
  id: string
  voucherNo: string
  date: string
  supplier: string
  store: string
  items: number
  totalValue: number
  receivedBy: string
  status: "Draft" | "Received" | "Approved"
}

const mockReceivings: GoodsReceiving[] = [
  {
    id: "1",
    voucherNo: "GR-2025-0001",
    date: "2025-12-19",
    supplier: "ABC Steel Supply",
    store: "Main Warehouse",
    items: 5,
    totalValue: 45000,
    receivedBy: "John Doe",
    status: "Approved",
  },
  {
    id: "2",
    voucherNo: "GR-2025-0002",
    date: "2025-12-18",
    supplier: "XYZ Cement Co.",
    store: "Site Store - Tower",
    items: 3,
    totalValue: 28500,
    receivedBy: "Mike Johnson",
    status: "Received",
  },
]

export default function GoodsReceivingPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [receivings, setReceivings] = useState<GoodsReceiving[]>(mockReceivings)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReceiving, setEditingReceiving] = useState<GoodsReceiving | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [receivingToDelete, setReceivingToDelete] = useState<string | null>(null)

  const handleSave = (data: any) => {
    if (editingReceiving) {
      setReceivings(receivings.map((r) => (r.id === editingReceiving.id ? { ...r, ...data } : r)))
      toast({ title: "Goods Receiving Updated", description: "Record has been updated successfully." })
    } else {
      const newReceiving: GoodsReceiving = {
        id: Date.now().toString(),
        voucherNo: `GR-2025-${String(receivings.length + 1).padStart(4, "0")}`,
        ...data,
      }
      setReceivings([...receivings, newReceiving])
      toast({ title: "Goods Receiving Created", description: "New record has been created successfully." })
    }
    setIsModalOpen(false)
    setEditingReceiving(null)
  }

  const handleEdit = (receiving: GoodsReceiving) => {
    setEditingReceiving(receiving)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setReceivings(receivings.filter((r) => r.id !== id))
    toast({ title: "Record Deleted", description: "Goods receiving record has been deleted successfully." })
  }

  const columns: ColumnDef<GoodsReceiving>[] = [
    {
      accessorKey: "voucherNo",
      header: ({ column }: { column: any }) => <SortableHeader column={column}>Voucher #</SortableHeader>,
      cell: ({ row }: { row: any }) => <span className="font-medium">{row.getValue("voucherNo")}</span>,
    },
    {
      accessorKey: "date",
      header: ({ column }: { column: any }) => <SortableHeader column={column}>Date</SortableHeader>,
    },
    {
      accessorKey: "supplier",
      header: "Supplier",
    },
    {
      accessorKey: "store",
      header: "Store",
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }: { row: any }) => <span>{row.getValue("items")} items</span>,
    },
    {
      accessorKey: "totalValue",
      header: "Total Value",
      cell: ({ row }: { row: any }) => <span>{formatCurrency(row.getValue("totalValue"))}</span>,
    },
    {
      accessorKey: "receivedBy",
      header: "Received By",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "Approved" ? "default" : status === "Received" ? "secondary" : "outline"}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => router.push(`/goods-receiving/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setReceivingToDelete(row.original.id)
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
    { name: "supplier", label: "Supplier", type: "text" as const, required: true },
    { name: "store", label: "Store", type: "text" as const, required: true },
    { name: "items", label: "Number of Items", type: "number" as const, required: true },
    { name: "totalValue", label: "Total Value", type: "number" as const, required: true },
    { name: "receivedBy", label: "Received By", type: "text" as const, required: true },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      options: ["Draft", "Received", "Approved"],
      required: true,
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Goods <span className="text-primary">Receiving</span></h1>
            <p className="text-muted-foreground mt-1">Record and manage items received into warehouse inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] rounded-xl px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Receiving
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Receivings", value: receivings.length, icon: <FileText className="h-5 w-5" />, color: "text-blue-400" },
            { label: "Total Value", value: formatCurrency(receivings.reduce((sum, r) => sum + r.totalValue, 0)), icon: <Plus className="h-5 w-5" />, color: "text-emerald-400" },
            { label: "Pending Approval", value: receivings.filter((r) => r.status === "Received").length, icon: <AlertCircle className="h-5 w-5" />, color: "text-amber-400" },
            { label: "Approved", value: receivings.filter((r) => r.status === "Approved").length, icon: <Package className="h-5 w-5" />, color: "text-emerald-500" },
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
            <DataTable columns={columns} data={receivings} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {receivings.map((receiving) => (
              <GridCard
                key={receiving.id}
                title={receiving.voucherNo}
                subtitle={receiving.supplier}
                badges={[{ label: receiving.status, variant: receiving.status === "Approved" ? "default" : receiving.status === "Received" ? "secondary" : "outline" }]}
                metadata={[
                  { icon: Package, label: receiving.store },
                  { icon: FileText, label: `${receiving.items} items` },
                  { icon: Plus, label: formatCurrency(receiving.totalValue) },
                ]}
                onView={() => router.push(`/goods-receiving/${receiving.id}`)}
                onEdit={() => handleEdit(receiving)}
                onDelete={() => {
                  setReceivingToDelete(receiving.id)
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
          if (!open) setEditingReceiving(null)
        }}
        onSubmit={() => handleSave({})} // Simplified for now
        title={editingReceiving ? "Edit Goods Receiving" : "New Goods Receiving"}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormFieldWrapper label="Date" required>
            <Input type="date" defaultValue={editingReceiving?.date} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Supplier" required>
            <Input defaultValue={editingReceiving?.supplier} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Store" required>
            <Input defaultValue={editingReceiving?.store} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Received By" required>
            <Input defaultValue={editingReceiving?.receivedBy} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Status" required>
            <Select defaultValue={editingReceiving?.status || "Draft"}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
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
          if (receivingToDelete) handleDelete(receivingToDelete)
          setDeleteDialogOpen(false)
        }}
        title="Delete Goods Receiving"
        description="Are you sure you want to delete this goods receiving record? This action cannot be undone."
      />
    </ErpLayout>
  )
}
