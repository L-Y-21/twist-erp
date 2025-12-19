"use client"

import { useState } from "react"
import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { CrudModal } from "@/components/crud-modal"
import { DeleteDialog } from "@/components/delete-dialog"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { PrintTemplate } from "@/components/print-template"
import { AttachmentUploader } from "@/components/attachment-uploader"
import { ViewSwitcher } from "@/components/view-switcher"
import { GridCard } from "@/components/grid-card"
import { Plus, Download, Filter, Edit, Trash2, Printer, MoreVertical } from "lucide-react"
import { DataTable, SortableHeader } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { type Project, mockProjects } from "@/lib/mock-data"
import { navigationConfig } from "@/lib/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { generateId, simulateDelay, formatDate, formatDateTime, formatCurrency } from "@/lib/utils"
import { PermissionGuard } from "@/components/permission-guard"

interface ExtendedProject extends Project {
  attachments?: Array<{
    id: string
    name: string
    size: number
    type: string
    url: string
    uploadedAt: Date
    uploadedBy: string
  }>
  branch?: string
  manager?: string
  description?: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ExtendedProject[]>(
    mockProjects.map((p) => ({ ...p, attachments: [], branch: "Main Office", manager: "John Admin" })),
  )
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<ExtendedProject | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    status: "Planning" as Project["status"],
    budget: 0,
    spent: 0,
    startDate: "",
    endDate: "",
    progress: 0,
    branch: "",
    manager: "",
    description: "",
  })
  const [view, setView] = useState<"grid" | "table">("table")

  const columns: ColumnDef<ExtendedProject>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column}>Project ID</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
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
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = row.getValue("progress") as number
        return (
          <div className="flex items-center gap-2 w-32">
            <Progress value={progress} className="h-2" />
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: "budget",
      header: ({ column }) => <SortableHeader column={column}>Budget</SortableHeader>,
      cell: ({ row }) => {
        const budget = row.getValue("budget") as number
        return <span>${budget.toLocaleString()}</span>
      },
    },
    {
      accessorKey: "spent",
      header: ({ column }) => <SortableHeader column={column}>Spent</SortableHeader>,
      cell: ({ row }) => {
        const spent = row.getValue("spent") as number
        return <span>${spent.toLocaleString()}</span>
      },
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => <SortableHeader column={column}>End Date</SortableHeader>,
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
            <DropdownMenuItem onClick={() => handlePrint(row.original)}>
              <Printer className="mr-2 h-4 w-4" />
              Print
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
    setFormData({
      name: "",
      status: "Planning",
      budget: 0,
      spent: 0,
      startDate: "",
      endDate: "",
      progress: 0,
      branch: "",
      manager: "",
      description: "",
    })
    setIsAddModalOpen(true)
  }

  const handleEdit = (project: ExtendedProject) => {
    setCurrentProject(project)
    setFormData({
      name: project.name,
      status: project.status,
      budget: project.budget,
      spent: project.spent,
      startDate: project.startDate,
      endDate: project.endDate,
      progress: project.progress,
      branch: project.branch || "",
      manager: project.manager || "",
      description: project.description || "",
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (project: ExtendedProject) => {
    setCurrentProject(project)
    setIsDeleteDialogOpen(true)
  }

  const handlePrint = (project: ExtendedProject) => {
    setCurrentProject(project)
    setIsPrintModalOpen(true)
  }

  const handleSubmitAdd = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    await simulateDelay(1000)

    const newProject: ExtendedProject = {
      id: `PRJ-${String(projects.length + 1).padStart(3, "0")}`,
      ...formData,
      attachments: [],
    }

    setProjects([newProject, ...projects])
    setIsAddModalOpen(false)
    setIsLoading(false)
    toast.success("Project added successfully")
  }

  const handleSubmitEdit = async () => {
    if (!currentProject) return

    setIsLoading(true)
    await simulateDelay(1000)

    setProjects(projects.map((p) => (p.id === currentProject.id ? { ...p, ...formData } : p)))
    setIsEditModalOpen(false)
    setIsLoading(false)
    setCurrentProject(null)
    toast.success("Project updated successfully")
  }

  const handleConfirmDelete = async () => {
    if (!currentProject) return

    setIsLoading(true)
    await simulateDelay(1000)

    setProjects(projects.filter((p) => p.id !== currentProject.id))
    setIsDeleteDialogOpen(false)
    setIsLoading(false)
    setCurrentProject(null)
    toast.success("Project deleted successfully")
  }

  const handleUploadAttachment = (projectId: string, files: FileList) => {
    const newAttachments = Array.from(files).map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
      uploadedBy: "Current User",
    }))

    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, attachments: [...(p.attachments || []), ...newAttachments] } : p,
      ),
    )
    toast.success("Attachment(s) uploaded successfully")
  }

  const handleDeleteAttachment = (projectId: string, attachmentId: string) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, attachments: p.attachments?.filter((a) => a.id !== attachmentId) } : p,
      ),
    )
    toast.success("Attachment deleted successfully")
  }

  return (
    <ErpLayout navigation={navigationConfig}>
      <PermissionGuard module="projects">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>
              <p className="text-muted-foreground">Manage your construction projects</p>
            </div>
            <div className="flex gap-2">
              <ViewSwitcher view={view} onViewChange={setView} />
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Projects</div>
              <div className="text-2xl font-bold">{projects.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Active</div>
              <div className="text-2xl font-bold text-accent">
                {projects.filter((p) => p.status === "Active").length}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Budget</div>
              <div className="text-2xl font-bold">
                ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Spent</div>
              <div className="text-2xl font-bold">
                ${projects.reduce((sum, p) => sum + p.spent, 0).toLocaleString()}
              </div>
            </Card>
          </div>

          {view === "table" ? (
            <Card className="p-6">
              <DataTable columns={columns} data={projects} searchKey="name" searchPlaceholder="Search projects..." />
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <GridCard
                  key={project.id}
                  data={project}
                  module="projects"
                  onEdit={(id) => handleEdit(projects.find((p) => p.id === id)!)}
                  onDelete={(id) => handleDelete(projects.find((p) => p.id === id)!)}
                  renderContent={(data) => (
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{data.name}</h3>
                        <p className="text-sm text-muted-foreground">{data.id}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            data.status === "Active"
                              ? "default"
                              : data.status === "Completed"
                                ? "secondary"
                                : data.status === "On Hold"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {data.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{data.progress}% Complete</span>
                      </div>
                      <Progress value={data.progress} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <div>
                          <div className="text-muted-foreground">Budget</div>
                          <div className="font-semibold">{formatCurrency(data.budget)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-muted-foreground">Spent</div>
                          <div className="font-semibold">{formatCurrency(data.spent)}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">Due: {data.endDate}</div>
                    </div>
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <CrudModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          title="Add New Project"
          description="Create a new construction project"
          onSubmit={handleSubmitAdd}
          isLoading={isLoading}
          submitLabel="Create Project"
          size="xl"
        >
          <div className="grid gap-4">
            <FormFieldWrapper label="Project Name" required>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </FormFieldWrapper>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormFieldWrapper label="Status" required>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Project["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
              <FormFieldWrapper label="Progress">
                <Input
                  type="number"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                  min="0"
                  max="100"
                />
              </FormFieldWrapper>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormFieldWrapper label="Budget" required>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                />
              </FormFieldWrapper>
              <FormFieldWrapper label="Spent">
                <Input
                  type="number"
                  value={formData.spent}
                  onChange={(e) => setFormData({ ...formData, spent: Number(e.target.value) })}
                />
              </FormFieldWrapper>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormFieldWrapper label="Start Date" required>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </FormFieldWrapper>
              <FormFieldWrapper label="End Date" required>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </FormFieldWrapper>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormFieldWrapper label="Branch">
                <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Office">Main Office</SelectItem>
                    <SelectItem value="Site A">Site A</SelectItem>
                    <SelectItem value="Site B">Site B</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
              <FormFieldWrapper label="Project Manager">
                <Input
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                />
              </FormFieldWrapper>
            </div>
            <FormFieldWrapper label="Description">
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </FormFieldWrapper>
          </div>
        </CrudModal>

        {currentProject && (
          <CrudModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            title="Edit Project"
            description="Update project information"
            onSubmit={handleSubmitEdit}
            isLoading={isLoading}
            submitLabel="Save Changes"
            size="xl"
          >
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4 mt-4">
                <FormFieldWrapper label="Project Name" required>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </FormFieldWrapper>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormFieldWrapper label="Status" required>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as Project["status"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                  <FormFieldWrapper label="Progress">
                    <Input
                      type="number"
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                      min="0"
                      max="100"
                    />
                  </FormFieldWrapper>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormFieldWrapper label="Budget" required>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper label="Spent">
                    <Input
                      type="number"
                      value={formData.spent}
                      onChange={(e) => setFormData({ ...formData, spent: Number(e.target.value) })}
                    />
                  </FormFieldWrapper>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormFieldWrapper label="Start Date" required>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper label="End Date" required>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </FormFieldWrapper>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormFieldWrapper label="Branch">
                    <Select
                      value={formData.branch}
                      onValueChange={(value) => setFormData({ ...formData, branch: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Main Office">Main Office</SelectItem>
                        <SelectItem value="Site A">Site A</SelectItem>
                        <SelectItem value="Site B">Site B</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                  <FormFieldWrapper label="Project Manager">
                    <Input
                      value={formData.manager}
                      onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    />
                  </FormFieldWrapper>
                </div>
                <FormFieldWrapper label="Description">
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </FormFieldWrapper>
              </TabsContent>
              <TabsContent value="attachments" className="mt-4">
                <AttachmentUploader
                  attachments={currentProject.attachments || []}
                  onUpload={(files) => handleUploadAttachment(currentProject.id, files)}
                  onDelete={(id) => handleDeleteAttachment(currentProject.id, id)}
                />
              </TabsContent>
            </Tabs>
          </CrudModal>
        )}

        {currentProject && (
          <CrudModal
            open={isPrintModalOpen}
            onOpenChange={setIsPrintModalOpen}
            title="Print Project Report"
            onSubmit={() => setIsPrintModalOpen(false)}
            submitLabel="Close"
            size="xl"
          >
            <PrintTemplate
              title={`Project: ${currentProject.name}`}
              headerContent={
                <div>
                  <div className="text-2xl font-bold">TWIST ERP</div>
                  <div className="text-lg">Project Report</div>
                  <div className="text-sm text-gray-600">Generated: {formatDateTime(new Date())}</div>
                </div>
              }
              footerContent={
                <div className="flex justify-between items-center text-xs">
                  <div>TWIST ERP System - Project Management</div>
                  <div>Page 1 of 1</div>
                </div>
              }
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Project ID</div>
                    <div className="text-base">{currentProject.id}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Project Name</div>
                    <div className="text-base">{currentProject.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Status</div>
                    <div className="text-base">{currentProject.status}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Progress</div>
                    <div className="text-base">{currentProject.progress}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Budget</div>
                    <div className="text-base">{formatCurrency(currentProject.budget)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Spent</div>
                    <div className="text-base">{formatCurrency(currentProject.spent)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Start Date</div>
                    <div className="text-base">{formatDate(currentProject.startDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">End Date</div>
                    <div className="text-base">{formatDate(currentProject.endDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Branch</div>
                    <div className="text-base">{currentProject.branch}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Manager</div>
                    <div className="text-base">{currentProject.manager}</div>
                  </div>
                </div>
                {currentProject.description && (
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Description</div>
                    <div className="text-base">{currentProject.description}</div>
                  </div>
                )}
              </div>
            </PrintTemplate>
          </CrudModal>
        )}

        <DeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          title="Delete Project"
          description={`Are you sure you want to delete ${currentProject?.name}? This action cannot be undone.`}
          isLoading={isLoading}
        />
      </PermissionGuard>
    </ErpLayout>
  )
}
