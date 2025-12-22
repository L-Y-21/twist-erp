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
import { Plus, Edit, Trash2, Eye, ArrowRightLeft, Truck, CheckCircle, DollarSign } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { formatCurrency, cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormFieldWrapper } from "@/components/form-field-wrapper"

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
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Store <span className="text-primary">Transfer</span></h1>
            <p className="text-muted-foreground mt-1">Transfer items between stores and warehouses</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button
              onClick={() => {
                setEditingTransfer(null)
                setIsModalOpen(true)
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] rounded-xl px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Transfers", value: transfers.length, icon: <ArrowRightLeft className="h-5 w-5" />, color: "text-blue-600" },
            { label: "Total Value", value: formatCurrency(transfers.reduce((sum, t) => sum + t.totalValue, 0)), icon: <DollarSign className="h-5 w-5" />, color: "text-emerald-600" },
            { label: "In Transit", value: transfers.filter((t) => t.status === "In Transit").length, icon: <Truck className="h-5 w-5" />, color: "text-amber-600" },
            { label: "Completed", value: transfers.filter((t) => t.status === "Completed").length, icon: <CheckCircle className="h-5 w-5" />, color: "text-emerald-600" },
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
            <DataTable columns={columns} data={transfers} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {transfers.map((transfer) => (
              <GridCard
                key={transfer.id}
                title={transfer.voucherNo}
                subtitle={`${transfer.fromStore} → ${transfer.toStore}`}
                badges={[{ label: transfer.status, variant: transfer.status === "Completed" ? "default" : transfer.status === "In Transit" ? "secondary" : "outline" }]}
                metadata={[
                  { icon: ArrowRightLeft, label: transfer.date },
                  { icon: Truck, label: `${transfer.items} items` },
                  { icon: DollarSign, label: formatCurrency(transfer.totalValue) },
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
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setEditingTransfer(null)
        }}
        onSubmit={() => handleSave({})}
        title={editingTransfer ? "Edit Store Transfer" : "New Store Transfer"}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormFieldWrapper label="Date" required>
            <Input type="date" defaultValue={editingTransfer?.date} />
          </FormFieldWrapper>
          <FormFieldWrapper label="From Store" required>
            <Input defaultValue={editingTransfer?.fromStore} />
          </FormFieldWrapper>
          <FormFieldWrapper label="To Store" required>
            <Input defaultValue={editingTransfer?.toStore} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Items" required>
            <Input type="number" defaultValue={editingTransfer?.items} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Total Value" required>
            <Input type="number" defaultValue={editingTransfer?.totalValue} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Transferred By" required>
            <Input defaultValue={editingTransfer?.transferredBy} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Status" required>
            <Select defaultValue={editingTransfer?.status || "Draft"}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        </div>
      </CrudModal>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
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
