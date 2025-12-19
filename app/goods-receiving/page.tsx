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
import { Plus, Edit, Trash2, Eye, Package } from "lucide-react"
import type { ColumnDef } from "@tantml:react-table"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"

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
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
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
      header: ({ column }) => <SortableHeader column={column}>Voucher #</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("voucherNo")}</span>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
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
      cell: ({ row }) => <span>{row.getValue("items")} items</span>,
    },
    {
      accessorKey: "totalValue",
      header: "Total Value",
      cell: ({ row }) => <span>{formatCurrency(row.getValue("totalValue"))}</span>,
    },
    {
      accessorKey: "receivedBy",
      header: "Received By",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
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
      cell: ({ row }) => (
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Goods Receiving</h1>
            <p className="text-muted-foreground">Record receiving of items into store</p>
          </div>
          <div className="flex gap-2">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Receiving
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Receivings</div>
            <div className="text-2xl font-bold">{receivings.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold">
              {formatCurrency(receivings.reduce((sum, r) => sum + r.totalValue, 0))}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Pending Approval</div>
            <div className="text-2xl font-bold">{receivings.filter((r) => r.status === "Received").length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-2xl font-bold text-green-600">
              {receivings.filter((r) => r.status === "Approved").length}
            </div>
          </Card>
        </div>

        {viewMode === "list" ? (
          <Card className="p-6">
            <DataTable columns={columns} data={receivings} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {receivings.map((receiving) => (
              <GridCard
                key={receiving.id}
                icon={<Package className="h-5 w-5" />}
                title={receiving.voucherNo}
                subtitle={receiving.supplier}
                status={receiving.status}
                fields={[
                  { label: "Date", value: receiving.date },
                  { label: "Store", value: receiving.store },
                  { label: "Items", value: `${receiving.items} items` },
                  { label: "Value", value: formatCurrency(receiving.totalValue) },
                  { label: "Received By", value: receiving.receivedBy },
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
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingReceiving(null)
        }}
        onSave={handleSave}
        title={editingReceiving ? "Edit Goods Receiving" : "New Goods Receiving"}
        fields={formFields}
        initialData={editingReceiving || undefined}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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
