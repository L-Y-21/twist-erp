"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable, SortableHeader } from "@/components/data-table"
import { FormDialog } from "@/components/form-dialog"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { DeleteDialog } from "@/components/delete-dialog"
import { Plus, FileText, Calendar } from "lucide-react"

// Mock Data for Store Issues
interface StoreIssue {
  id: string
  date: string
  requestedBy: string
  project: string
  status: "Draft" | "Approved" | "Issued" | "Complete"
  itemsCount: number
}

const mockIssues: StoreIssue[] = [
  { id: "ISS-2025-001", date: "2025-12-20", requestedBy: "John Smith", project: "Downtown Tower", status: "Complete", itemsCount: 5 },
  { id: "ISS-2025-002", date: "2025-12-21", requestedBy: "Mike Johnson", project: "Highway Extension", status: "Approved", itemsCount: 12 },
  { id: "ISS-2025-003", date: "2025-12-21", requestedBy: "Sarah Connor", project: "HQ Renovation", status: "Draft", itemsCount: 3 },
]

export default function StoreIssuePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [issues, setIssues] = useState<StoreIssue[]>(mockIssues)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [currentIssue, setCurrentIssue] = useState<StoreIssue | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<Partial<StoreIssue>>({})

  const handleDelete = (issue: StoreIssue) => {
    setIssueToDelete(issue.id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (issueToDelete) {
      setIsLoading(true)
      setTimeout(() => {
        setIssues(issues.filter((i) => i.id !== issueToDelete))
        setIsLoading(false)
        setDeleteDialogOpen(false)
        setIssueToDelete(null)
        toast({
          title: "Issue Deleted",
          description: "The store issue has been successfully deleted.",
        })
      }, 500)
    }
  }

  const handleEdit = (issue: StoreIssue) => {
    setCurrentIssue(issue)
    setFormData(issue)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setCurrentIssue(null)
    setFormData({
      id: `ISS-2025-00${Math.floor(Math.random() * 100) + 4}`,
      date: new Date().toISOString().split('T')[0],
      status: "Draft",
      itemsCount: 0,
    })
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.project || !formData.requestedBy) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      if (dialogMode === "create") {
        setIssues([...issues, formData as StoreIssue])
        toast({ title: "Issue Created", description: "New store issue created." })
      } else {
        setIssues(issues.map(i => i.id === currentIssue?.id ? (formData as StoreIssue) : i))
        toast({ title: "Issue Updated", description: "Store issue details updated." })
      }
      setIsLoading(false)
      setDialogOpen(false)
    }, 500)
  }

  const columns: ColumnDef<StoreIssue>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column}>Issue No.</SortableHeader>,
      cell: ({ row }) => <span className="font-medium text-primary">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-foreground/80">
          <Calendar className="h-3 w-3" />
          <span>{row.getValue("date")}</span>
        </div>
      ),
    },
    {
      accessorKey: "project",
      header: "Project",
      cell: ({ row }) => <span className="font-medium text-foreground">{row.getValue("project")}</span>,
    },
    {
      accessorKey: "requestedBy",
      header: "Requested By",
      cell: ({ row }) => <span className="text-foreground">{row.getValue("requestedBy")}</span>,
    },
    {
      accessorKey: "itemsCount",
      header: "Items",
      cell: ({ row }) => <span className="font-medium text-foreground">{row.getValue("itemsCount")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const colorMap = {
          "Complete": "text-emerald-700 bg-emerald-100",
          "Issued": "text-blue-700 bg-blue-100",
          "Approved": "text-purple-700 bg-purple-100",
          "Draft": "text-slate-700 bg-slate-100"
        }
        return (
          <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${colorMap[status as keyof typeof colorMap]}`}>
            {status}
          </span>
        )
      },
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Store Issues</h1>
            <p className="text-muted-foreground">Manage material issuance to projects</p>
          </div>
          <Button onClick={handleCreate} className="shadow-lg hover:shadow-xl transition-all">
            <Plus className="h-4 w-4 mr-2" />
            New Issue
          </Button>
        </div>

        <Card className="p-0 border-none shadow-sm bg-transparent">
          <DataTable
            columns={columns}
            data={issues}
            searchKey="project"
            searchPlaceholder="Search by project..."
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleEdit}
            onPrint={(issue) => toast({ title: "Printing Issue Slip", description: `Printing slip for ${issue.id}` })}
          />
        </Card>
      </div>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogMode === "create" ? "New Store Issue" : `Edit: ${currentIssue?.id}`}
        onSave={handleSave}
        isSaving={isLoading}
        maxWidth="3xl"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="project">Project <span className="text-destructive">*</span></Label>
              <Select
                value={formData.project}
                onValueChange={(val) => setFormData({ ...formData, project: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Downtown Tower">Downtown Tower</SelectItem>
                  <SelectItem value="Highway Extension">Highway Extension</SelectItem>
                  <SelectItem value="HQ Renovation">HQ Renovation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="requestedBy">Requested By <span className="text-destructive">*</span></Label>
              <Input
                id="requestedBy"
                value={formData.requestedBy || ""}
                onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                placeholder="e.g. John Smith"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date Needed</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                className="min-h-[120px]"
                placeholder="Additional instructions..."
              />
            </div>
          </div>
        </div>

        {/* Placeholder for Items Grid */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Items to Issue</h3>
          <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground bg-muted/20">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Items selection grid would go here</p>
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Issue"
        description="Are you sure you want to delete this store issue? This action cannot be undone."
      />
    </ErpLayout>
  )
}
