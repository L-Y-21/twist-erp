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
import { Plus, Edit, Trash2, Eye, ArrowRightLeft } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface StoreTransfer {
  id: string
  voucherNo: string
  date: string
  fromStore: string
  toStore: string
  items: number
  totalValue: number
  transferredBy: string
  status: "Draft" | "In Transit" | "Completed"
}

const mockTransfers: StoreTransfer[] = [
  {
    id: "1",
    voucherNo: "ST-2025-0001",
    date: "2025-12-19",
    fromStore: "Main Warehouse",
    toStore: "Site Store - Tower",
    items: 6,
    totalValue: 22000,
    transferredBy: "David Smith",
    status: "Completed",
  },
  {
    id: "2",
    voucherNo: "ST-2025-0002",
    date: "2025-12-18",
    fromStore: "Site Store - Tower",
    toStore: "Site Store - Bridge",
    items: 4,
    totalValue: 15500,
    transferredBy: "Emily Brown",
    status: "In Transit",
  },
]

export default function StoreTransferPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [transfers, setTransfers] = useState<StoreTransfer[]>(mockTransfers)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransfer, setEditingTransfer] = useState<StoreTransfer | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transferToDelete, setTransferToDelete] = useState<string | null>(null)

  const handleSave = (data: any) => {
    if (editingTransfer) {
      setTransfers(transfers.map((t) => (t.id === editingTransfer.id ? { ...t, ...data } : t)))
      toast({ title: "Transfer Updated", description: "Record has been updated successfully." })
    } else {
      const newTransfer: StoreTransfer = {
        id: Date.now().toString(),
        voucherNo: `ST-2025-${String(transfers.length + 1).padStart(4, "0")}`,
        ...data,
      }
      setTransfers([...transfers, newTransfer])
      toast({ title: "Transfer Created", description: "New record has been created successfully." })
    }
    setIsModalOpen(false)
    setEditingTransfer(null)
  }

  const handleEdit = (transfer: StoreTransfer) => {
    setEditingTransfer(transfer)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setTransfers(transfers.filter((t) => t.id !== id))
    toast({ title: "Record Deleted", description: "Transfer record has been deleted successfully." })
  }

  const columns: ColumnDef<StoreTransfer>[] = [
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
      accessorKey: "fromStore",
      header: "From Store",
    },
    {
      accessorKey: "toStore",
      header: "To Store",
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
      accessorKey: "transferredBy",
      header: "Transferred By",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "Completed" ? "default" : status === "In Transit" ? "secondary" : "outline"}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => router.push(`/store-transfer/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setTransferToDelete(row.original.id)
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
    { name: "fromStore", label: "From Store", type: "text" as const, required: true },
    { name: "toStore", label: "To Store", type: "text" as const, required: true },
    { name: "items", label: "Number of Items", type: "number" as const, required: true },
    { name: "totalValue", label: "Total Value", type: "number" as const, required: true },
    { name: "transferredBy", label: "Transferred By", type: "text" as const, required: true },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      options: ["Draft", "In Transit", "Completed"],
      required: true,
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Store Transfer</h1>
            <p className="text-muted-foreground">Transfer items between stores</p>
          </div>
          <div className="flex gap-2">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Transfers</div>
            <div className="text-2xl font-bold">{transfers.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold">
              {formatCurrency(transfers.reduce((sum, t) => sum + t.totalValue, 0))}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">In Transit</div>
            <div className="text-2xl font-bold">{transfers.filter((t) => t.status === "In Transit").length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold text-green-600">
              {transfers.filter((t) => t.status === "Completed").length}
            </div>
          </Card>
        </div>

        {viewMode === "list" ? (
          <Card className="p-6">
            <DataTable columns={columns} data={transfers} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {transfers.map((transfer) => (
              <GridCard
                key={transfer.id}
                icon={<ArrowRightLeft className="h-5 w-5" />}
                title={transfer.voucherNo}
                subtitle={`${transfer.fromStore} → ${transfer.toStore}`}
                status={transfer.status}
                fields={[
                  { label: "Date", value: transfer.date },
                  { label: "Items", value: `${transfer.items} items` },
                  { label: "Value", value: formatCurrency(transfer.totalValue) },
                  { label: "Transferred By", value: transfer.transferredBy },
                ]}
                onView={() => router.push(`/store-transfer/${transfer.id}`)}
                onEdit={() => handleEdit(transfer)}
                onDelete={() => {
                  setTransferToDelete(transfer.id)
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
          setEditingTransfer(null)
        }}
        onSave={handleSave}
        title={editingTransfer ? "Edit Store Transfer" : "New Store Transfer"}
        fields={formFields}
        initialData={editingTransfer || undefined}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (transferToDelete) handleDelete(transferToDelete)
          setDeleteDialogOpen(false)
        }}
        title="Delete Store Transfer"
        description="Are you sure you want to delete this transfer record? This action cannot be undone."
      />
    </ErpLayout>
  )
}
