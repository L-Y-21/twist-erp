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
import { Plus, Edit, Trash2, Eye, FileText, Clock, CheckCircle, DollarSign } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { formatCurrency, cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormFieldWrapper } from "@/components/form-field-wrapper"

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
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
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
      header: ({ column }: { column: any }) => <SortableHeader column={column}>Requisition #</SortableHeader>,
      cell: ({ row }: { row: any }) => <span className="font-medium">{row.getValue("requisitionNo")}</span>,
    },
    {
      accessorKey: "date",
      header: ({ column }: { column: any }) => <SortableHeader column={column}>Date</SortableHeader>,
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
      cell: ({ row }: { row: any }) => <span>{row.getValue("items")} items</span>,
    },
    {
      accessorKey: "estimatedValue",
      header: "Est. Value",
      cell: ({ row }: { row: any }) => <span>{formatCurrency(row.getValue("estimatedValue"))}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
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
      cell: ({ row }: { row: any }) => (
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Item <span className="text-primary">Requisitions</span></h1>
            <p className="text-muted-foreground mt-1">Request and manage items for projects and departments</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button
              onClick={() => {
                setEditingRequisition(null)
                setIsModalOpen(true)
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] rounded-xl px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Requisition
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Requisitions", value: requisitions.length, icon: <FileText className="h-5 w-5" />, color: "text-blue-600" },
            { label: "Pending", value: requisitions.filter((r) => r.status === "Pending").length, icon: <Clock className="h-5 w-5" />, color: "text-amber-600" },
            { label: "Approved", value: requisitions.filter((r) => r.status === "Approved").length, icon: <CheckCircle className="h-5 w-5" />, color: "text-emerald-600" },
            { label: "Total Est. Value", value: formatCurrency(requisitions.reduce((sum, r) => sum + r.estimatedValue, 0)), icon: <DollarSign className="h-5 w-5" />, color: "text-emerald-600" },
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
            <DataTable columns={columns} data={requisitions} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requisitions.map((requisition) => (
              <GridCard
                key={requisition.id}
                title={requisition.requisitionNo}
                subtitle={requisition.requestedBy}
                badges={[{ label: requisition.status, variant: requisition.status === "Approved" ? "default" : requisition.status === "Pending" ? "secondary" : "destructive" }]}
                metadata={[
                  { icon: FileText, label: requisition.department },
                  { icon: CheckCircle, label: requisition.project },
                  { icon: DollarSign, label: formatCurrency(requisition.estimatedValue) },
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
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setEditingRequisition(null)
        }}
        onSubmit={() => handleSave({})}
        title={editingRequisition ? "Edit Requisition" : "New Requisition"}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormFieldWrapper label="Date" required>
            <Input type="date" defaultValue={editingRequisition?.date} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Requested By" required>
            <Input defaultValue={editingRequisition?.requestedBy} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Department" required>
            <Input defaultValue={editingRequisition?.department} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Project" required>
            <Input defaultValue={editingRequisition?.project} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Items" required>
            <Input type="number" defaultValue={editingRequisition?.items} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Estimated Value" required>
            <Input type="number" defaultValue={editingRequisition?.estimatedValue} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Status" required>
            <Select defaultValue={editingRequisition?.status || "Pending"}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Fulfilled">Fulfilled</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        </div>
      </CrudModal>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
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
