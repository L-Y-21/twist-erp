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
import { Plus, Edit, Trash2, Eye, Undo2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface PurchaseReturn {
  id: string
  returnNo: string
  date: string
  supplier: string
  reason: string
  items: number
  returnValue: number
  returnedBy: string
  status: "Draft" | "Returned" | "Approved"
}

const mockReturns: PurchaseReturn[] = [
  {
    id: "1",
    returnNo: "PR-2025-0001",
    date: "2025-12-19",
    supplier: "ABC Steel Supply",
    reason: "Defective materials",
    items: 3,
    returnValue: 12500,
    returnedBy: "Robert Johnson",
    status: "Approved",
  },
  {
    id: "2",
    returnNo: "PR-2025-0002",
    date: "2025-12-18",
    supplier: "XYZ Cement Co.",
    reason: "Wrong specification",
    items: 2,
    returnValue: 8200,
    returnedBy: "Jennifer Lee",
    status: "Returned",
  },
]

export default function PurchaseReturnPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [returns, setReturns] = useState<PurchaseReturn[]>(mockReturns)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReturn, setEditingReturn] = useState<PurchaseReturn | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [returnToDelete, setReturnToDelete] = useState<string | null>(null)

  const handleSave = (data: any) => {
    if (editingReturn) {
      setReturns(returns.map((r) => (r.id === editingReturn.id ? { ...r, ...data } : r)))
      toast({ title: "Purchase Return Updated", description: "Record has been updated successfully." })
    } else {
      const newReturn: PurchaseReturn = {
        id: Date.now().toString(),
        returnNo: `PR-2025-${String(returns.length + 1).padStart(4, "0")}`,
        ...data,
      }
      setReturns([...returns, newReturn])
      toast({ title: "Purchase Return Created", description: "New record has been created successfully." })
    }
    setIsModalOpen(false)
    setEditingReturn(null)
  }

  const handleEdit = (returnItem: PurchaseReturn) => {
    setEditingReturn(returnItem)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setReturns(returns.filter((r) => r.id !== id))
    toast({ title: "Record Deleted", description: "Purchase return has been deleted successfully." })
  }

  const columns: ColumnDef<PurchaseReturn>[] = [
    {
      accessorKey: "returnNo",
      header: ({ column }) => <SortableHeader column={column}>Return #</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("returnNo")}</span>,
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
      accessorKey: "reason",
      header: "Reason",
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => <span>{row.getValue("items")} items</span>,
    },
    {
      accessorKey: "returnValue",
      header: "Return Value",
      cell: ({ row }) => <span>{formatCurrency(row.getValue("returnValue"))}</span>,
    },
    {
      accessorKey: "returnedBy",
      header: "Returned By",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "Approved" ? "default" : status === "Returned" ? "secondary" : "outline"}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => router.push(`/purchase-return/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setReturnToDelete(row.original.id)
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
    { name: "reason", label: "Reason", type: "text" as const, required: true },
    { name: "items", label: "Number of Items", type: "number" as const, required: true },
    { name: "returnValue", label: "Return Value", type: "number" as const, required: true },
    { name: "returnedBy", label: "Returned By", type: "text" as const, required: true },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      options: ["Draft", "Returned", "Approved"],
      required: true,
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Purchase Return</h1>
            <p className="text-muted-foreground">Return items to suppliers</p>
          </div>
          <div className="flex gap-2">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Return
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Returns</div>
            <div className="text-2xl font-bold">{returns.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold">
              {formatCurrency(returns.reduce((sum, r) => sum + r.returnValue, 0))}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Pending Approval</div>
            <div className="text-2xl font-bold">{returns.filter((r) => r.status === "Returned").length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-2xl font-bold text-green-600">
              {returns.filter((r) => r.status === "Approved").length}
            </div>
          </Card>
        </div>

        {viewMode === "list" ? (
          <Card className="p-6">
            <DataTable columns={columns} data={returns} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {returns.map((returnItem) => (
              <GridCard
                key={returnItem.id}
                icon={<Undo2 className="h-5 w-5" />}
                title={returnItem.returnNo}
                subtitle={returnItem.supplier}
                status={returnItem.status}
                fields={[
                  { label: "Date", value: returnItem.date },
                  { label: "Reason", value: returnItem.reason },
                  { label: "Items", value: `${returnItem.items} items` },
                  { label: "Value", value: formatCurrency(returnItem.returnValue) },
                  { label: "Returned By", value: returnItem.returnedBy },
                ]}
                onView={() => router.push(`/purchase-return/${returnItem.id}`)}
                onEdit={() => handleEdit(returnItem)}
                onDelete={() => {
                  setReturnToDelete(returnItem.id)
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
          setEditingReturn(null)
        }}
        onSave={handleSave}
        title={editingReturn ? "Edit Purchase Return" : "New Purchase Return"}
        fields={formFields}
        initialData={editingReturn || undefined}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (returnToDelete) handleDelete(returnToDelete)
          setDeleteDialogOpen(false)
        }}
        title="Delete Purchase Return"
        description="Are you sure you want to delete this return record? This action cannot be undone."
      />
    </ErpLayout>
  )
}
