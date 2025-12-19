"use client"

import { useState } from "react"
import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Printer, MoreVertical } from "lucide-react"
import { DataTable, SortableHeader } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { navigationConfig } from "@/lib/navigation"
import { CrudModal } from "@/components/crud-modal"
import { DeleteDialog } from "@/components/delete-dialog"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { PrintTemplate } from "@/components/print-template"
import { AttachmentUploader } from "@/components/attachment-uploader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { generateId, simulateDelay, formatDate, formatDateTime } from "@/lib/utils"

interface WorkOrder {
  id: string
  orderNumber: string
  assetType: string
  assetId: string
  issueDescription: string
  priority: "Low" | "Medium" | "High" | "Critical"
  date: string
  assignedTo: string
  status: "Draft" | "Submitted" | "In Progress" | "Completed"
  estimatedCost: number
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
  notes?: string
}

const mockWorkOrders: WorkOrder[] = [
  {
    id: "1",
    orderNumber: "WO-2025-0056",
    assetType: "Vehicle",
    assetId: "CAT-001",
    issueDescription: "Engine oil change and filter replacement",
    priority: "Medium",
    date: "2025-12-18",
    assignedTo: "Mike Tech",
    status: "In Progress",
    estimatedCost: 450,
    attachments: [],
    branch: "Main Office",
    notes: "",
  },
  {
    id: "2",
    orderNumber: "WO-2025-0055",
    assetType: "Vehicle",
    assetId: "TRK-001",
    issueDescription: "Brake system inspection and repair",
    priority: "High",
    date: "2025-12-17",
    assignedTo: "John Mechanic",
    status: "Submitted",
    estimatedCost: 850,
    attachments: [],
    branch: "Site A",
    notes: "",
  },
  {
    id: "3",
    orderNumber: "WO-2025-0054",
    assetType: "Equipment",
    assetId: "GEN-001",
    issueDescription: "Generator preventive maintenance",
    priority: "Low",
    date: "2025-12-16",
    assignedTo: "Mike Tech",
    status: "Completed",
    estimatedCost: 300,
    attachments: [],
    branch: "Main Office",
    notes: "",
  },
]

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [currentWorkOrder, setCurrentWorkOrder] = useState<WorkOrder | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    assetType: "",
    assetId: "",
    issueDescription: "",
    priority: "Medium" as WorkOrder["priority"],
    date: "",
    assignedTo: "",
    status: "Draft" as WorkOrder["status"],
    estimatedCost: 0,
    branch: "",
    notes: "",
  })

  const columns: ColumnDef<WorkOrder>[] = [
    {
      accessorKey: "orderNumber",
      header: ({ column }) => <SortableHeader column={column}>Work Order #</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("orderNumber")}</span>,
    },
    {
      accessorKey: "assetType",
      header: "Asset Type",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("assetType")}</Badge>,
    },
    {
      accessorKey: "assetId",
      header: "Asset ID",
      cell: ({ row }) => <span className="font-mono">{row.getValue("assetId")}</span>,
    },
    {
      accessorKey: "issueDescription",
      header: "Description",
      cell: ({ row }) => {
        const desc = row.getValue("issueDescription") as string
        return <span className="max-w-xs truncate">{desc}</span>
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string
        return (
          <Badge
            variant={
              priority === "Critical" || priority === "High"
                ? "destructive"
                : priority === "Medium"
                  ? "default"
                  : "secondary"
            }
          >
            {priority}
          </Badge>
        )
      },
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "Completed" ? "default" : status === "In Progress" ? "secondary" : "outline"}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "estimatedCost",
      header: ({ column }) => <SortableHeader column={column}>Est. Cost</SortableHeader>,
      cell: ({ row }) => {
        const cost = row.getValue("estimatedCost") as number
        return <span>${cost.toFixed(2)}</span>
      },
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
      assetType: "",
      assetId: "",
      issueDescription: "",
      priority: "Medium",
      date: "",
      assignedTo: "",
      status: "Draft",
      estimatedCost: 0,
      branch: "",
      notes: "",
    })
    setIsAddModalOpen(true)
  }

  const handleEdit = (workOrder: WorkOrder) => {
    setCurrentWorkOrder(workOrder)
    setFormData({
      assetType: workOrder.assetType,
      assetId: workOrder.assetId,
      issueDescription: workOrder.issueDescription,
      priority: workOrder.priority,
      date: workOrder.date,
      assignedTo: workOrder.assignedTo,
      status: workOrder.status,
      estimatedCost: workOrder.estimatedCost,
      branch: workOrder.branch || "",
      notes: workOrder.notes || "",
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (workOrder: WorkOrder) => {
    setCurrentWorkOrder(workOrder)
    setIsDeleteDialogOpen(true)
  }

  const handlePrint = (workOrder: WorkOrder) => {
    setCurrentWorkOrder(workOrder)
    setIsPrintModalOpen(true)
  }

  const handleSubmitAdd = async () => {
    if (!formData.assetType || !formData.assetId || !formData.issueDescription) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    await simulateDelay(1000)

    const newWorkOrder: WorkOrder = {
      id: generateId(),
      orderNumber: `WO-2025-${String(workOrders.length + 100).padStart(4, "0")}`,
      ...formData,
      attachments: [],
    }

    setWorkOrders([newWorkOrder, ...workOrders])
    setIsAddModalOpen(false)
    setIsLoading(false)
    toast.success("Work order created successfully")
  }

  const handleSubmitEdit = async () => {
    if (!currentWorkOrder) return

    setIsLoading(true)
    await simulateDelay(1000)

    setWorkOrders(workOrders.map((wo) => (wo.id === currentWorkOrder.id ? { ...wo, ...formData } : wo)))
    setIsEditModalOpen(false)
    setIsLoading(false)
    setCurrentWorkOrder(null)
    toast.success("Work order updated successfully")
  }

  const handleConfirmDelete = async () => {
    if (!currentWorkOrder) return

    setIsLoading(true)
    await simulateDelay(1000)

    setWorkOrders(workOrders.filter((wo) => wo.id !== currentWorkOrder.id))
    setIsDeleteDialogOpen(false)
    setIsLoading(false)
    setCurrentWorkOrder(null)
    toast.success("Work order deleted successfully")
  }

  const handleUploadAttachment = (workOrderId: string, files: FileList) => {
    const newAttachments = Array.from(files).map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
      uploadedBy: "Current User",
    }))

    setWorkOrders(
      workOrders.map((wo) =>
        wo.id === workOrderId ? { ...wo, attachments: [...(wo.attachments || []), ...newAttachments] } : wo,
      ),
    )
    toast.success("Attachment(s) uploaded successfully")
  }

  const handleDeleteAttachment = (workOrderId: string, attachmentId: string) => {
    setWorkOrders(
      workOrders.map((wo) =>
        wo.id === workOrderId ? { ...wo, attachments: wo.attachments?.filter((a) => a.id !== attachmentId) } : wo,
      ),
    )
    toast.success("Attachment deleted successfully")
  }

  const totalCost = workOrders.reduce((sum, wo) => sum + wo.estimatedCost, 0)

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Work Orders</h1>
            <p className="text-muted-foreground">Manage maintenance and service tasks</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Orders</div>
            <div className="text-2xl font-bold">{workOrders.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">In Progress</div>
            <div className="text-2xl font-bold text-accent">
              {workOrders.filter((wo) => wo.status === "In Progress").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">High Priority</div>
            <div className="text-2xl font-bold text-destructive">
              {workOrders.filter((wo) => wo.priority === "High" || wo.priority === "Critical").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Est. Cost</div>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          </Card>
        </div>

        <Card className="p-6">
          <DataTable
            columns={columns}
            data={workOrders}
            searchKey="orderNumber"
            searchPlaceholder="Search work orders..."
          />
        </Card>
      </div>

      <CrudModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Create Work Order"
        description="Create a new maintenance or service work order"
        onSubmit={handleSubmitAdd}
        isLoading={isLoading}
        submitLabel="Create Work Order"
        size="xl"
      >
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormFieldWrapper label="Asset Type" required>
              <Select
                value={formData.assetType}
                onValueChange={(value) => setFormData({ ...formData, assetType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vehicle">Vehicle</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Building">Building</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <FormFieldWrapper label="Asset ID" required>
              <Input value={formData.assetId} onChange={(e) => setFormData({ ...formData, assetId: e.target.value })} />
            </FormFieldWrapper>
          </div>
          <FormFieldWrapper label="Issue Description" required>
            <Textarea
              value={formData.issueDescription}
              onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
              rows={3}
            />
          </FormFieldWrapper>
          <div className="grid sm:grid-cols-3 gap-4">
            <FormFieldWrapper label="Priority">
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as WorkOrder["priority"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <FormFieldWrapper label="Status">
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as WorkOrder["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <FormFieldWrapper label="Date">
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </FormFieldWrapper>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormFieldWrapper label="Assigned To">
              <Input
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Estimated Cost">
              <Input
                type="number"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
              />
            </FormFieldWrapper>
          </div>
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
          <FormFieldWrapper label="Notes">
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </FormFieldWrapper>
        </div>
      </CrudModal>

      {currentWorkOrder && (
        <CrudModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          title="Edit Work Order"
          description="Update work order information"
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
              <div className="grid sm:grid-cols-2 gap-4">
                <FormFieldWrapper label="Asset Type" required>
                  <Select
                    value={formData.assetType}
                    onValueChange={(value) => setFormData({ ...formData, assetType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vehicle">Vehicle</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Building">Building</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
                <FormFieldWrapper label="Asset ID" required>
                  <Input
                    value={formData.assetId}
                    onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                  />
                </FormFieldWrapper>
              </div>
              <FormFieldWrapper label="Issue Description" required>
                <Textarea
                  value={formData.issueDescription}
                  onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                  rows={3}
                />
              </FormFieldWrapper>
              <div className="grid sm:grid-cols-3 gap-4">
                <FormFieldWrapper label="Priority">
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as WorkOrder["priority"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
                <FormFieldWrapper label="Status">
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as WorkOrder["status"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
                <FormFieldWrapper label="Date">
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </FormFieldWrapper>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormFieldWrapper label="Assigned To">
                  <Input
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper label="Estimated Cost">
                  <Input
                    type="number"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                  />
                </FormFieldWrapper>
              </div>
              <FormFieldWrapper label="Branch">
                <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
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
              <FormFieldWrapper label="Notes">
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </FormFieldWrapper>
            </TabsContent>
            <TabsContent value="attachments" className="mt-4">
              <AttachmentUploader
                attachments={currentWorkOrder.attachments || []}
                onUpload={(files) => handleUploadAttachment(currentWorkOrder.id, files)}
                onDelete={(id) => handleDeleteAttachment(currentWorkOrder.id, id)}
              />
            </TabsContent>
          </Tabs>
        </CrudModal>
      )}

      {currentWorkOrder && (
        <CrudModal
          open={isPrintModalOpen}
          onOpenChange={setIsPrintModalOpen}
          title="Print Work Order"
          onSubmit={() => setIsPrintModalOpen(false)}
          submitLabel="Close"
          size="xl"
        >
          <PrintTemplate
            title={`Work Order: ${currentWorkOrder.orderNumber}`}
            headerContent={
              <div>
                <div className="text-2xl font-bold">TWIST ERP</div>
                <div className="text-lg">Work Order</div>
                <div className="text-sm text-gray-600">Generated: {formatDateTime(new Date())}</div>
              </div>
            }
            footerContent={
              <div className="flex justify-between items-center text-xs">
                <div>TWIST ERP System - Service Management</div>
                <div>Page 1 of 1</div>
              </div>
            }
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">Work Order #</div>
                  <div className="text-base">{currentWorkOrder.orderNumber}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Date</div>
                  <div className="text-base">{formatDate(currentWorkOrder.date)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Asset Type</div>
                  <div className="text-base">{currentWorkOrder.assetType}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Asset ID</div>
                  <div className="text-base">{currentWorkOrder.assetId}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Priority</div>
                  <div className="text-base">{currentWorkOrder.priority}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Status</div>
                  <div className="text-base">{currentWorkOrder.status}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Assigned To</div>
                  <div className="text-base">{currentWorkOrder.assignedTo}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Estimated Cost</div>
                  <div className="text-base">${currentWorkOrder.estimatedCost.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Branch</div>
                  <div className="text-base">{currentWorkOrder.branch}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Issue Description</div>
                <div className="text-base">{currentWorkOrder.issueDescription}</div>
              </div>
              {currentWorkOrder.notes && (
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Notes</div>
                  <div className="text-base">{currentWorkOrder.notes}</div>
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
        title="Delete Work Order"
        description={`Are you sure you want to delete work order ${currentWorkOrder?.orderNumber}? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </ErpLayout>
  )
}
