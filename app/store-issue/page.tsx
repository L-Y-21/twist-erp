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
import { Plus, Package } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"
import ActionMenu from "@/components/action-menu" // Import ActionMenu component

interface StoreIssue {
  id: string
  voucherNo: string
  date: string
  issuedTo: string
  project: string
  store: string
  items: number
  totalValue: number
  issuedBy: string
  status: "Draft" | "Issued" | "Approved"
}

const mockIssues: StoreIssue[] = [
  {
    id: "1",
    voucherNo: "SI-2025-0001",
    date: "2025-12-19",
    issuedTo: "Tower Construction Site",
    project: "Tower Project",
    store: "Main Warehouse",
    items: 8,
    totalValue: 35000,
    issuedBy: "Sarah Johnson",
    status: "Approved",
  },
  {
    id: "2",
    voucherNo: "SI-2025-0002",
    date: "2025-12-18",
    issuedTo: "Bridge Maintenance Team",
    project: "Bridge Repair",
    store: "Site Store - Tower",
    items: 5,
    totalValue: 18500,
    issuedBy: "Mike Wilson",
    status: "Issued",
  },
]

export default function StoreIssuePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [issues, setIssues] = useState<StoreIssue[]>(mockIssues)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<StoreIssue | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null)

  const handleSave = (data: any) => {
    if (editingIssue) {
      setIssues(issues.map((i) => (i.id === editingIssue.id ? { ...i, ...data } : i)))
      toast({ title: "Store Issue Updated", description: "Record has been updated successfully." })
    } else {
      const newIssue: StoreIssue = {
        id: Date.now().toString(),
        voucherNo: `SI-2025-${String(issues.length + 1).padStart(4, "0")}`,
        ...data,
      }
      setIssues([...issues, newIssue])
      toast({ title: "Store Issue Created", description: "New record has been created successfully." })
    }
    setIsModalOpen(false)
    setEditingIssue(null)
  }

  const handleEdit = (issue: StoreIssue) => {
    setEditingIssue(issue)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setIssues(issues.filter((i) => i.id !== id))
    toast({ title: "Record Deleted", description: "Store issue record has been deleted successfully." })
  }

  const columns: ColumnDef<StoreIssue>[] = [
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
      accessorKey: "issuedTo",
      header: "Issued To",
    },
    {
      accessorKey: "project",
      header: "Project",
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
      accessorKey: "issuedBy",
      header: "Issued By",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "Approved" ? "default" : status === "Issued" ? "secondary" : "outline"}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionMenu
          onView={() => router.push(`/store-issue/${row.original.id}`)}
          onEdit={() => handleEdit(row.original)}
          onDelete={() => {
            setIssueToDelete(row.original.id)
            setDeleteDialogOpen(true)
          }}
          onDownload={() => {
            toast({ title: "Downloaded", description: "Voucher downloaded successfully." })
          }}
        />
      ),
    },
  ]

  const formFields = [
    { name: "date", label: "Date", type: "date" as const, required: true },
    { name: "issuedTo", label: "Issued To", type: "text" as const, required: true },
    { name: "project", label: "Project", type: "text" as const, required: true },
    { name: "store", label: "Store", type: "text" as const, required: true },
    { name: "items", label: "Number of Items", type: "number" as const, required: true },
    { name: "totalValue", label: "Total Value", type: "number" as const, required: true },
    { name: "issuedBy", label: "Issued By", type: "text" as const, required: true },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      options: ["Draft", "Issued", "Approved"],
      required: true,
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Store Issue</h1>
            <p className="text-muted-foreground">Issue items from store to projects or departments</p>
          </div>
          <div className="flex gap-2">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Issue
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Issues</div>
            <div className="text-2xl font-bold">{issues.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold">{formatCurrency(issues.reduce((sum, i) => sum + i.totalValue, 0))}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Pending Approval</div>
            <div className="text-2xl font-bold">{issues.filter((i) => i.status === "Issued").length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-2xl font-bold text-green-600">
              {issues.filter((i) => i.status === "Approved").length}
            </div>
          </Card>
        </div>

        {viewMode === "list" ? (
          <Card className="p-6">
            <DataTable columns={columns} data={issues} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <GridCard
                key={issue.id}
                icon={<Package className="h-5 w-5" />}
                title={issue.voucherNo}
                subtitle={issue.issuedTo}
                status={issue.status}
                fields={[
                  { label: "Date", value: issue.date },
                  { label: "Project", value: issue.project },
                  { label: "Store", value: issue.store },
                  { label: "Items", value: `${issue.items} items` },
                  { label: "Value", value: formatCurrency(issue.totalValue) },
                  { label: "Issued By", value: issue.issuedBy },
                ]}
                onView={() => router.push(`/store-issue/${issue.id}`)}
                onEdit={() => handleEdit(issue)}
                onDelete={() => {
                  setIssueToDelete(issue.id)
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
          setEditingIssue(null)
        }}
        onSave={handleSave}
        title={editingIssue ? "Edit Store Issue" : "New Store Issue"}
        fields={formFields}
        initialData={editingIssue || undefined}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (issueToDelete) handleDelete(issueToDelete)
          setDeleteDialogOpen(false)
        }}
        title="Delete Store Issue"
        description="Are you sure you want to delete this store issue record? This action cannot be undone."
      />
    </ErpLayout>
  )
}
