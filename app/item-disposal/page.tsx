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
import { Plus, Edit, Trash2, Eye, AlertTriangle } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ItemDisposal {
  id: string
  disposalNo: string
  date: string
  store: string
  reason: string
  items: number
  disposalValue: number
  disposedBy: string
  status: "Draft" | "Approved"
}

const mockDisposals: ItemDisposal[] = [
  {
    id: "1",
    disposalNo: "DIS-2025-0001",
    date: "2025-12-19",
    store: "Main Warehouse",
    reason: "Expired materials",
    items: 3,
    disposalValue: 5500,
    disposedBy: "Amanda White",
    status: "Approved",
  },
  {
    id: "2",
    disposalNo: "DIS-2025-0002",
    date: "2025-12-18",
    store: "Site Store - Tower",
    reason: "Damaged beyond repair",
    items: 2,
    disposalValue: 3200,
    disposedBy: "Kevin Brown",
    status: "Draft",
  },
]

export default function ItemDisposalPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [disposals, setDisposals] = useState<ItemDisposal[]>(mockDisposals)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDisposal, setEditingDisposal] = useState<ItemDisposal | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [disposalToDelete, setDisposalToDelete] = useState<string | null>(null)

  const handleSave = (data: any) => {
    if (editingDisposal) {
      setDisposals(disposals.map((d) => (d.id === editingDisposal.id ? { ...d, ...data } : d)))
      toast({ title: "Disposal Updated", description: "Record has been updated successfully." })
    } else {
      const newDisposal: ItemDisposal = {
        id: Date.now().toString(),
        disposalNo: `DIS-2025-${String(disposals.length + 1).padStart(4, "0")}`,
        ...data,
      }
      setDisposals([...disposals, newDisposal])
      toast({ title: "Disposal Created", description: "New record has been created successfully." })
    }
    setIsModalOpen(false)
    setEditingDisposal(null)
  }

  const handleEdit = (disposal: ItemDisposal) => {
    setEditingDisposal(disposal)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setDisposals(disposals.filter((d) => d.id !== id))
    toast({ title: "Record Deleted", description: "Disposal record has been deleted successfully." })
  }

  const columns: ColumnDef<ItemDisposal>[] = [
    {
      accessorKey: "disposalNo",
      header: ({ column }) => <SortableHeader column={column}>Disposal #</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("disposalNo")}</span>,
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
      accessorKey: "disposalValue",
      header: "Disposal Value",
      cell: ({ row }) => <span className="text-red-600">{formatCurrency(row.getValue("disposalValue"))}</span>,
    },
    {
      accessorKey: "disposedBy",
      header: "Disposed By",
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
          <Button size="sm" variant="ghost" onClick={() => router.push(`/item-disposal/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setDisposalToDelete(row.original.id)
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
    { name: "disposalValue", label: "Disposal Value", type: "number" as const, required: true },
    { name: "disposedBy", label: "Disposed By", type: "text" as const, required: true },
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Item Disposal</h1>
            <p className="text-muted-foreground">Record disposal of obsolete or damaged items</p>
          </div>
          <div className="flex gap-2">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Disposal
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Disposals</div>
            <div className="text-2xl font-bold">{disposals.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(disposals.reduce((sum, d) => sum + d.disposalValue, 0))}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Pending Approval</div>
            <div className="text-2xl font-bold">{disposals.filter((d) => d.status === "Draft").length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-2xl font-bold text-green-600">
              {disposals.filter((d) => d.status === "Approved").length}
            </div>
          </Card>
        </div>

        {viewMode === "list" ? (
          <Card className="p-6">
            <DataTable columns={columns} data={disposals} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {disposals.map((disposal) => (
              <GridCard
                key={disposal.id}
                icon={<AlertTriangle className="h-5 w-5" />}
                title={disposal.disposalNo}
                subtitle={disposal.store}
                status={disposal.status}
                fields={[
                  { label: "Date", value: disposal.date },
                  { label: "Reason", value: disposal.reason },
                  { label: "Items", value: `${disposal.items} items` },
                  { label: "Value", value: formatCurrency(disposal.disposalValue) },
                  { label: "Disposed By", value: disposal.disposedBy },
                ]}
                onView={() => router.push(`/item-disposal/${disposal.id}`)}
                onEdit={() => handleEdit(disposal)}
                onDelete={() => {
                  setDisposalToDelete(disposal.id)
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
          setEditingDisposal(null)
        }}
        onSave={handleSave}
        title={editingDisposal ? "Edit Item Disposal" : "New Item Disposal"}
        fields={formFields}
        initialData={editingDisposal || undefined}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (disposalToDelete) handleDelete(disposalToDelete)
          setDeleteDialogOpen(false)
        }}
        title="Delete Item Disposal"
        description="Are you sure you want to delete this disposal record? This action cannot be undone."
      />
    </ErpLayout>
  )
}
