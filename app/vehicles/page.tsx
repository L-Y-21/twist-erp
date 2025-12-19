"use client"

import { useState } from "react"
import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Download, Filter, Edit, Trash2, Printer, MoreVertical, Truck } from "lucide-react"
import { DataTable, SortableHeader } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { type Vehicle, mockVehicles } from "@/lib/mock-data"
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
import { ViewSwitcher } from "@/components/view-switcher"
import { GridCard } from "@/components/grid-card"
import { PermissionGuard } from "@/components/permission-guard"

interface ExtendedVehicle extends Vehicle {
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
  year?: string
  mileage?: number
  notes?: string
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<ExtendedVehicle[]>(
    mockVehicles.map((v) => ({
      ...v,
      attachments: [],
      branch: "Main Office",
      year: "2022",
      mileage: 15000,
      notes: "",
    })),
  )
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [currentVehicle, setCurrentVehicle] = useState<ExtendedVehicle | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    plate: "",
    status: "Available" as Vehicle["status"],
    driver: "",
    lastMaintenance: "",
    branch: "",
    year: "",
    mileage: 0,
    notes: "",
  })
  const [view, setView] = useState<"grid" | "table">("table")

  const columns: ColumnDef<ExtendedVehicle>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column}>Vehicle ID</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Vehicle Name</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("type")}</span>,
    },
    {
      accessorKey: "plate",
      header: "Plate Number",
      cell: ({ row }) => <span className="font-mono font-medium">{row.getValue("plate")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "Available" ? "outline" : status === "In Use" ? "default" : "destructive"}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "driver",
      header: "Current Driver",
      cell: ({ row }) => {
        const driver = row.getValue("driver") as string | undefined
        return driver ? <span>{driver}</span> : <span className="text-muted-foreground">Unassigned</span>
      },
    },
    {
      accessorKey: "lastMaintenance",
      header: ({ column }) => <SortableHeader column={column}>Last Maintenance</SortableHeader>,
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
      type: "",
      plate: "",
      status: "Available",
      driver: "",
      lastMaintenance: "",
      branch: "",
      year: "",
      mileage: 0,
      notes: "",
    })
    setIsAddModalOpen(true)
  }

  const handleEdit = (vehicle: ExtendedVehicle) => {
    setCurrentVehicle(vehicle)
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      plate: vehicle.plate,
      status: vehicle.status,
      driver: vehicle.driver || "",
      lastMaintenance: vehicle.lastMaintenance,
      branch: vehicle.branch || "",
      year: vehicle.year || "",
      mileage: vehicle.mileage || 0,
      notes: vehicle.notes || "",
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (vehicle: ExtendedVehicle) => {
    setCurrentVehicle(vehicle)
    setIsDeleteDialogOpen(true)
  }

  const handlePrint = (vehicle: ExtendedVehicle) => {
    setCurrentVehicle(vehicle)
    setIsPrintModalOpen(true)
  }

  const handleSubmitAdd = async () => {
    if (!formData.name || !formData.plate || !formData.type) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    await simulateDelay(1000)

    const newVehicle: ExtendedVehicle = {
      id: `VEH-${String(vehicles.length + 1).padStart(3, "0")}`,
      ...formData,
      attachments: [],
    }

    setVehicles([newVehicle, ...vehicles])
    setIsAddModalOpen(false)
    setIsLoading(false)
    toast.success("Vehicle added successfully")
  }

  const handleSubmitEdit = async () => {
    if (!currentVehicle) return

    setIsLoading(true)
    await simulateDelay(1000)

    setVehicles(vehicles.map((v) => (v.id === currentVehicle.id ? { ...v, ...formData } : v)))
    setIsEditModalOpen(false)
    setIsLoading(false)
    setCurrentVehicle(null)
    toast.success("Vehicle updated successfully")
  }

  const handleConfirmDelete = async () => {
    if (!currentVehicle) return

    setIsLoading(true)
    await simulateDelay(1000)

    setVehicles(vehicles.filter((v) => v.id !== currentVehicle.id))
    setIsDeleteDialogOpen(false)
    setIsLoading(false)
    setCurrentVehicle(null)
    toast.success("Vehicle deleted successfully")
  }

  const handleUploadAttachment = (vehicleId: string, files: FileList) => {
    const newAttachments = Array.from(files).map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
      uploadedBy: "Current User",
    }))

    setVehicles(
      vehicles.map((v) =>
        v.id === vehicleId ? { ...v, attachments: [...(v.attachments || []), ...newAttachments] } : v,
      ),
    )
    toast.success("Attachment(s) uploaded successfully")
  }

  const handleDeleteAttachment = (vehicleId: string, attachmentId: string) => {
    setVehicles(
      vehicles.map((v) =>
        v.id === vehicleId ? { ...v, attachments: v.attachments?.filter((a) => a.id !== attachmentId) } : v,
      ),
    )
    toast.success("Attachment deleted successfully")
  }

  return (
    <ErpLayout navigation={navigationConfig}>
      <PermissionGuard module="vehicles">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Fleet Management</h1>
              <p className="text-muted-foreground">Manage vehicles and equipment</p>
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
                Add Vehicle
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Vehicles</div>
              <div className="text-2xl font-bold">{vehicles.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">In Use</div>
              <div className="text-2xl font-bold text-accent">
                {vehicles.filter((v) => v.status === "In Use").length}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Available</div>
              <div className="text-2xl font-bold text-green-600">
                {vehicles.filter((v) => v.status === "Available").length}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Maintenance</div>
              <div className="text-2xl font-bold text-destructive">
                {vehicles.filter((v) => v.status === "Maintenance").length}
              </div>
            </Card>
          </div>

          {view === "table" ? (
            <Card className="p-6">
              <DataTable columns={columns} data={vehicles} searchKey="name" searchPlaceholder="Search vehicles..." />
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <GridCard
                  key={vehicle.id}
                  data={vehicle}
                  module="vehicles"
                  onEdit={(id) => handleEdit(vehicles.find((v) => v.id === id)!)}
                  onDelete={(id) => handleDelete(vehicles.find((v) => v.id === id)!)}
                  renderContent={(data) => (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Truck className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{data.name}</h3>
                          <p className="text-sm text-muted-foreground">{data.plate}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            data.status === "Available"
                              ? "default"
                              : data.status === "In Use"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {data.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{data.type}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground">Mileage</div>
                          <div className="font-medium">{data.mileage.toLocaleString()} km</div>
                        </div>
                        <div className="text-right">
                          <div className="text-muted-foreground">Driver</div>
                          <div className="font-medium truncate">{data.driver || "N/A"}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">Year: {data.year}</div>
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
          title="Add New Vehicle"
          description="Register a new vehicle or equipment"
          onSubmit={handleSubmitAdd}
          isLoading={isLoading}
          submitLabel="Add Vehicle"
          size="xl"
        >
          <div className="grid gap-4">
            <FormFieldWrapper label="Vehicle Name" required>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </FormFieldWrapper>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormFieldWrapper label="Type" required>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excavator">Excavator</SelectItem>
                    <SelectItem value="Concrete Mixer">Concrete Mixer</SelectItem>
                    <SelectItem value="Pickup Truck">Pickup Truck</SelectItem>
                    <SelectItem value="Dump Truck">Dump Truck</SelectItem>
                    <SelectItem value="Crane">Crane</SelectItem>
                    <SelectItem value="Forklift">Forklift</SelectItem>
                    <SelectItem value="Generator">Generator</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
              <FormFieldWrapper label="Plate Number" required>
                <Input value={formData.plate} onChange={(e) => setFormData({ ...formData, plate: e.target.value })} />
              </FormFieldWrapper>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormFieldWrapper label="Status">
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Vehicle["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="In Use">In Use</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
              <FormFieldWrapper label="Current Driver">
                <Input value={formData.driver} onChange={(e) => setFormData({ ...formData, driver: e.target.value })} />
              </FormFieldWrapper>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <FormFieldWrapper label="Year">
                <Input value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Mileage">
                <Input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                />
              </FormFieldWrapper>
              <FormFieldWrapper label="Last Maintenance">
                <Input
                  type="date"
                  value={formData.lastMaintenance}
                  onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
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
                rows={3}
              />
            </FormFieldWrapper>
          </div>
        </CrudModal>

        {currentVehicle && (
          <CrudModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            title="Edit Vehicle"
            description="Update vehicle information"
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
                <FormFieldWrapper label="Vehicle Name" required>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </FormFieldWrapper>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormFieldWrapper label="Type" required>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excavator">Excavator</SelectItem>
                        <SelectItem value="Concrete Mixer">Concrete Mixer</SelectItem>
                        <SelectItem value="Pickup Truck">Pickup Truck</SelectItem>
                        <SelectItem value="Dump Truck">Dump Truck</SelectItem>
                        <SelectItem value="Crane">Crane</SelectItem>
                        <SelectItem value="Forklift">Forklift</SelectItem>
                        <SelectItem value="Generator">Generator</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                  <FormFieldWrapper label="Plate Number" required>
                    <Input
                      value={formData.plate}
                      onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                    />
                  </FormFieldWrapper>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormFieldWrapper label="Status">
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as Vehicle["status"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="In Use">In Use</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                  <FormFieldWrapper label="Current Driver">
                    <Input
                      value={formData.driver}
                      onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    />
                  </FormFieldWrapper>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <FormFieldWrapper label="Year">
                    <Input value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                  </FormFieldWrapper>
                  <FormFieldWrapper label="Mileage">
                    <Input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper label="Last Maintenance">
                    <Input
                      type="date"
                      value={formData.lastMaintenance}
                      onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                    />
                  </FormFieldWrapper>
                </div>
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
                <FormFieldWrapper label="Notes">
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </FormFieldWrapper>
              </TabsContent>
              <TabsContent value="attachments" className="mt-4">
                <AttachmentUploader
                  attachments={currentVehicle.attachments || []}
                  onUpload={(files) => handleUploadAttachment(currentVehicle.id, files)}
                  onDelete={(id) => handleDeleteAttachment(currentVehicle.id, id)}
                />
              </TabsContent>
            </Tabs>
          </CrudModal>
        )}

        {currentVehicle && (
          <CrudModal
            open={isPrintModalOpen}
            onOpenChange={setIsPrintModalOpen}
            title="Print Vehicle Report"
            onSubmit={() => setIsPrintModalOpen(false)}
            submitLabel="Close"
            size="xl"
          >
            <PrintTemplate
              title={`Vehicle: ${currentVehicle.name}`}
              headerContent={
                <div>
                  <div className="text-2xl font-bold">TWIST ERP</div>
                  <div className="text-lg">Vehicle Report</div>
                  <div className="text-sm text-gray-600">Generated: {formatDateTime(new Date())}</div>
                </div>
              }
              footerContent={
                <div className="flex justify-between items-center text-xs">
                  <div>TWIST ERP System - Fleet Management</div>
                  <div>Page 1 of 1</div>
                </div>
              }
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Vehicle ID</div>
                    <div className="text-base">{currentVehicle.id}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Vehicle Name</div>
                    <div className="text-base">{currentVehicle.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Type</div>
                    <div className="text-base">{currentVehicle.type}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Plate Number</div>
                    <div className="text-base">{currentVehicle.plate}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Status</div>
                    <div className="text-base">{currentVehicle.status}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Current Driver</div>
                    <div className="text-base">{currentVehicle.driver || "Unassigned"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Year</div>
                    <div className="text-base">{currentVehicle.year}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Mileage</div>
                    <div className="text-base">{currentVehicle.mileage?.toLocaleString()} km</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Last Maintenance</div>
                    <div className="text-base">{formatDate(currentVehicle.lastMaintenance)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Branch</div>
                    <div className="text-base">{currentVehicle.branch}</div>
                  </div>
                </div>
                {currentVehicle.notes && (
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Notes</div>
                    <div className="text-base">{currentVehicle.notes}</div>
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
          title="Delete Vehicle"
          description={`Are you sure you want to delete ${currentVehicle?.name}? This action cannot be undone.`}
          isLoading={isLoading}
        />
      </PermissionGuard>
    </ErpLayout>
  )
}
