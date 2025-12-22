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
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Requisition {
  id: string
  requisitionNo: string
  date: string
  requestedBy: string
  department: string
  project: string
  items: number
  estimatedValue: number
  status: "Pending" | "Approved" | "Rejected" | "Fulfilled"
}

const mockRequisitions: Requisition[] = [
  {
    id: "1",
    requisitionNo: "REQ-2025-0001",
    date: "2025-12-19",
    requestedBy: "Michael Chen",
    department: "Operations",
    project: "Tower Project",
    items: 7,
    estimatedValue: 32000,
    status: "Approved",
  },
  {
    id: "2",
    requisitionNo: "REQ-2025-0002",
    date: "2025-12-18",
    requestedBy: "Sarah Martinez",
    department: "Maintenance",
    project: "Bridge Repair",
    items: 5,
    estimatedValue: 19500,
    status: "Pending",
  },
]

export default function RequisitionsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [requisitions, setRequisitions] = useState<Requisition[]>(mockRequisitions)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRequisition, setEditingRequisition] = useState<Requisition | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [requisitionToDelete, setRequisitionToDelete] = useState<string | null>(null)

  const handleSave = (data: any) => {
    if (editingRequisition) {
      setRequisitions(requisitions.map((r) => (r.id === editingRequisition.id ? { ...r, ...data } : r)))
      toast({ title: "Requisition Updated", description: "Record has been updated successfully." })
    } else {
      const newRequisition: Requisition = {
        id: Date.now().toString(),
        requisitionNo: `REQ-2025-${String(requisitions.length + 1).padStart(4, "0")}`,
        ...data,
      }
      setRequisitions([...requisitions, newRequisition])
      toast({ title: "Requisition Created", description: "New record has been created successfully." })
    }
    setIsModalOpen(false)
    setEditingRequisition(null)
  }

  const handleEdit = (requisition: Requisition) => {
    setEditingRequisition(requisition)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setRequisitions(requisitions.filter((r) => r.id !== id))
    toast({ title: "Record Deleted", description: "Requisition has been deleted successfully." })
  }

  const columns: ColumnDef<Requisition>[] = [
    {
      accessorKey: "requisitionNo",
      header: ({ column }) => <SortableHeader column={column}>Requisition #</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("requisitionNo")}</span>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
    },
    {
      accessorKey: "requestedBy",
      header: "Requested By",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "project",
      header: "Project",
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => <span>{row.getValue("items")} items</span>,
    },
    {
      accessorKey: "estimatedValue",
      header: "Est. Value",
      cell: ({ row }) => <span>{formatCurrency(row.getValue("estimatedValue"))}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const variant =
          status === "Approved"
            ? "default"
            : status === "Fulfilled"
              ? "default"
              : status === "Rejected"
                ? "destructive"
                : "secondary"
        return <Badge variant={variant}>{status}</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => router.push(`/requisitions/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setRequisitionToDelete(row.original.id)
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
    { name: "requestedBy", label: "Requested By", type: "text" as const, required: true },
    { name: "department", label: "Department", type: "text" as const, required: true },
    { name: "project", label: "Project", type: "text" as const, required: true },
    { name: "items", label: "Number of Items", type: "number" as const, required: true },
    { name: "estimatedValue", label: "Estimated Value", type: "number" as const, required: true },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      options: ["Pending", "Approved", "Rejected", "Fulfilled"],
      required: true,
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Item Requisitions</h1>
            <p className="text-muted-foreground">Request items for projects and departments</p>
          </div>
          <div className="flex gap-2">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Requisition
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Requisitions</div>
            <div className="text-2xl font-bold">{requisitions.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {requisitions.filter((r) => r.status === "Pending").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-2xl font-bold text-green-600">
              {requisitions.filter((r) => r.status === "Approved").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Est. Value</div>
            <div className="text-2xl font-bold">
              {formatCurrency(requisitions.reduce((sum, r) => sum + r.estimatedValue, 0))}
            </div>
          </Card>
        </div>

        {viewMode === "list" ? (
          <Card className="p-6">
            <DataTable columns={columns} data={requisitions} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requisitions.map((requisition) => (
              <GridCard
                key={requisition.id}
                icon={<FileText className="h-5 w-5" />}
                title={requisition.requisitionNo}
                subtitle={requisition.requestedBy}
                status={requisition.status}
                fields={[
                  { label: "Date", value: requisition.date },
                  { label: "Department", value: requisition.department },
                  { label: "Project", value: requisition.project },
                  { label: "Items", value: `${requisition.items} items` },
                  { label: "Est. Value", value: formatCurrency(requisition.estimatedValue) },
                ]}
                onView={() => router.push(`/requisitions/${requisition.id}`)}
                onEdit={() => handleEdit(requisition)}
                onDelete={() => {
                  setRequisitionToDelete(requisition.id)
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
          setEditingRequisition(null)
        }}
        onSave={handleSave}
        title={editingRequisition ? "Edit Requisition" : "New Requisition"}
        fields={formFields}
        initialData={editingRequisition || undefined}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (requisitionToDelete) handleDelete(requisitionToDelete)
          setDeleteDialogOpen(false)
        }}
        title="Delete Requisition"
        description="Are you sure you want to delete this requisition? This action cannot be undone."
      />
    </ErpLayout>
  )
}
