"use client"

import { useState, useEffect } from "react"
import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CrudModal } from "@/components/crud-modal"
import { DeleteDialog } from "@/components/delete-dialog"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { Plus, Download, Edit, Trash2, MoreVertical } from "lucide-react"
import { DataTable, SortableHeader } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { navigationConfig } from "@/lib/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { PermissionGuard } from "@/components/permission-guard"
import { simulateApi } from "@/lib/api/simulation"

interface Project {
  id: string
  name: string
  code: string
  status: string
  budget: number
  spent?: number
  progress?: number
  startDate?: string
  endDate?: string
}

export default function ProjectsPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "Planning",
    budget: 0,
    spent: 0,
    progress: 0,
  })
  const [view, setView] = useState<"grid" | "table">("table")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const data = await simulateApi.projects.getAll()
    setProjects(data as Project[])
    setIsLoading(false)
  }

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => <SortableHeader column={column}>Code</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("code")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Project Name</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={
              status === "Active"
                ? "default"
                : status === "Completed"
                  ? "secondary"
                  : status === "On Hold"
                    ? "destructive"
                    : "outline"
            }
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "budget",
      header: ({ column }) => <SortableHeader column={column}>Budget</SortableHeader>,
      cell: ({ row }) => <span>{formatCurrency(row.getValue("budget"))}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const handleAdd = () => {
    resetForm()
    setIsAddModalOpen(true)
  }

  const handleEdit = (project: Project) => {
    setCurrentProject(project)
    setFormData({
      name: project.name,
      code: project.code,
      status: project.status,
      budget: project.budget,
      spent: project.spent || 0,
      progress: project.progress || 0,
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (project: Project) => {
    setCurrentProject(project)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmitAdd = async () => {
    if (!formData.name || !formData.code) {
      toast({ title: "Error", description: "Name and Code are required", variant: "destructive" })
      return
    }

    setIsLoading(true)
    await simulateApi.projects.create(formData)
    setIsAddModalOpen(false)
    loadData()
    toast({ title: "Success", description: "Simulated: Project created" })
  }

  const handleSubmitEdit = async () => {
    if (!currentProject) return

    setIsLoading(true)
    await simulateApi.projects.update(currentProject.id, formData)
    setIsEditModalOpen(false)
    loadData()
    toast({ title: "Success", description: "Simulated: Project updated" })
  }

  const handleConfirmDelete = async () => {
    if (!currentProject) return

    setIsLoading(true)
    await simulateApi.projects.delete(currentProject.id)
    setIsDeleteDialogOpen(false)
    loadData()
    toast({ title: "Success", description: "Simulated: Project deleted" })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      status: "Planning",
      budget: 0,
      spent: 0,
      progress: 0,
    })
    setCurrentProject(null)
  }

  return (
    <ErpLayout navigation={navigationConfig}>
      <PermissionGuard module="projects">
        <div className="space-y-8">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight">Project Management</h1>
              <p className="text-muted-foreground">Manage construction lifecycle and simulation data</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="h-11 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleAdd} className="h-11 px-6">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card className="p-6 bg-card border-border/50 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Projects</p>
              <div className="text-3xl font-bold">{projects.length}</div>
              <p className="text-xs text-primary mt-2">
                Active focus: {projects.filter((p) => p.status === "Active").length}
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/50 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Budget</p>
              <div className="text-3xl font-bold">{formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}</div>
              <p className="text-xs text-muted-foreground mt-2">Allocated across all sites</p>
            </Card>
            <Card className="p-6 bg-card border-border/50 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Completion Avg</p>
              <div className="text-3xl font-bold">
                {projects.length > 0
                  ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
                  : 0}
                %
              </div>
              <p className="text-xs text-primary mt-2">Across overall portfolio</p>
            </Card>
            <Card className="p-6 bg-card border-border/50 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Status</p>
              <div className="text-3xl font-bold text-accent">Healthy</div>
              <p className="text-xs text-muted-foreground mt-2">All milestones on track</p>
            </Card>
          </div>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <DataTable columns={columns} data={projects} searchKey="name" searchPlaceholder="Search projects..." />
          </Card>
        </div>

        <CrudModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          title="Add New Project"
          description="Create a new construction project simulation"
          onSubmit={handleSubmitAdd}
          isLoading={isLoading}
          submitLabel="Create Project"
          size="xl"
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormFieldWrapper label="Project Code" required>
                  <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                </FormFieldWrapper>
              </div>
              <div className="space-y-2">
                <FormFieldWrapper label="Project Name" required>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </FormFieldWrapper>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormFieldWrapper label="Budget" required>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  />
                </FormFieldWrapper>
              </div>
              <div className="space-y-2">
                <FormFieldWrapper label="Status" required>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
              </div>
            </div>
          </div>
        </CrudModal>

        <DeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          isLoading={isLoading}
          title="Delete Project"
          description={`Are you sure you want to delete ${currentProject?.name}? This action cannot be undone.`}
        />
      </PermissionGuard>
    </ErpLayout>
  )
}
