"use client"

import { useState } from "react"
import { ErpLayout } from "@/components/erp-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CrudModal } from "@/components/crud-modal"
import { DeleteDialog } from "@/components/delete-dialog"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { PrintTemplate } from "@/components/print-template"
import { AttachmentUploader } from "@/components/attachment-uploader"
import { navigationConfig } from "@/lib/navigation"
import { Plus, Search, MoreVertical, Edit, Trash2, Printer, UserCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { generateId, simulateDelay, formatDate, formatDateTime } from "@/lib/utils"

interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  branch: string
  status: "active" | "inactive"
  hireDate: string
  salary: number
  attachments?: Array<{
    id: string
    name: string
    size: number
    type: string
    url: string
    uploadedAt: Date
    uploadedBy: string
  }>
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    name: "John Admin",
    email: "john@twisterp.com",
    phone: "+1234567890",
    position: "System Administrator",
    department: "IT",
    branch: "Main Office",
    status: "active",
    hireDate: "2020-01-15",
    salary: 75000,
    attachments: [],
  },
  {
    id: "2",
    employeeId: "EMP-002",
    name: "Sarah Manager",
    email: "sarah@twisterp.com",
    phone: "+1234567891",
    position: "Project Manager",
    department: "Operations",
    branch: "Main Office",
    status: "active",
    hireDate: "2021-03-20",
    salary: 85000,
    attachments: [],
  },
  {
    id: "3",
    employeeId: "EMP-003",
    name: "Mike Tech",
    email: "mike@twisterp.com",
    phone: "+1234567892",
    position: "Technician",
    department: "Maintenance",
    branch: "Site A",
    status: "active",
    hireDate: "2022-06-10",
    salary: 55000,
    attachments: [],
  },
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    branch: "",
    status: "active" as "active" | "inactive",
    hireDate: "",
    salary: 0,
  })

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdd = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      branch: "",
      status: "active",
      hireDate: "",
      salary: 0,
    })
    setIsAddModalOpen(true)
  }

  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee)
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      branch: employee.branch,
      status: employee.status,
      hireDate: employee.hireDate,
      salary: employee.salary,
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (employee: Employee) => {
    setCurrentEmployee(employee)
    setIsDeleteDialogOpen(true)
  }

  const handlePrint = (employee: Employee) => {
    setCurrentEmployee(employee)
    setIsPrintModalOpen(true)
  }

  const handleSubmitAdd = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    await simulateDelay(1000)

    const newEmployee: Employee = {
      id: generateId(),
      employeeId: `EMP-${String(employees.length + 1).padStart(3, "0")}`,
      ...formData,
      attachments: [],
    }

    setEmployees([newEmployee, ...employees])
    setIsAddModalOpen(false)
    setIsLoading(false)
    toast.success("Employee added successfully")
  }

  const handleSubmitEdit = async () => {
    if (!currentEmployee) return

    setIsLoading(true)
    await simulateDelay(1000)

    setEmployees(employees.map((emp) => (emp.id === currentEmployee.id ? { ...emp, ...formData } : emp)))
    setIsEditModalOpen(false)
    setIsLoading(false)
    setCurrentEmployee(null)
    toast.success("Employee updated successfully")
  }

  const handleConfirmDelete = async () => {
    if (!currentEmployee) return

    setIsLoading(true)
    await simulateDelay(1000)

    setEmployees(employees.filter((emp) => emp.id !== currentEmployee.id))
    setIsDeleteDialogOpen(false)
    setIsLoading(false)
    setCurrentEmployee(null)
    toast.success("Employee deleted successfully")
  }

  const handleUploadAttachment = (employeeId: string, files: FileList) => {
    const newAttachments = Array.from(files).map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
      uploadedBy: "Current User",
    }))

    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId ? { ...emp, attachments: [...(emp.attachments || []), ...newAttachments] } : emp,
      ),
    )
    toast.success("Attachment(s) uploaded successfully")
  }

  const handleDeleteAttachment = (employeeId: string, attachmentId: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId ? { ...emp, attachments: emp.attachments?.filter((a) => a.id !== attachmentId) } : emp,
      ),
    )
    toast.success("Attachment deleted successfully")
  }

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Employees</h1>
            <p className="text-muted-foreground">Manage employee information and records</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Employees</div>
            <div className="text-2xl font-bold">{employees.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-accent">
              {employees.filter((e) => e.status === "active").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Departments</div>
            <div className="text-2xl font-bold">{new Set(employees.map((e) => e.department)).size}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Branches</div>
            <div className="text-2xl font-bold">{new Set(employees.map((e) => e.branch)).size}</div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(employee)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrint(employee)}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(employee)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Position: </span>
                    {employee.position}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Department: </span>
                    {employee.department}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Branch: </span>
                    {employee.branch}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>{employee.status}</Badge>
                    <span className="text-muted-foreground">Since {formatDate(employee.hireDate)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      <CrudModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Add New Employee"
        description="Register a new employee"
        onSubmit={handleSubmitAdd}
        isLoading={isLoading}
        submitLabel="Add Employee"
        size="xl"
      >
        <div className="grid gap-4">
          <FormFieldWrapper label="Full Name" required>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </FormFieldWrapper>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormFieldWrapper label="Email" required>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Phone">
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </FormFieldWrapper>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormFieldWrapper label="Position">
              <Input
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Department">
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
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
            <FormFieldWrapper label="Hire Date">
              <Input
                type="date"
                value={formData.hireDate}
                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Salary">
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
              />
            </FormFieldWrapper>
          </div>
        </div>
      </CrudModal>

      {currentEmployee && (
        <CrudModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          title="Edit Employee"
          description="Update employee information"
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
              <FormFieldWrapper label="Full Name" required>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </FormFieldWrapper>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormFieldWrapper label="Email" required>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper label="Phone">
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </FormFieldWrapper>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormFieldWrapper label="Position">
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper label="Department">
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
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
                <FormFieldWrapper label="Hire Date">
                  <Input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper label="Salary">
                  <Input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                  />
                </FormFieldWrapper>
              </div>
            </TabsContent>
            <TabsContent value="attachments" className="mt-4">
              <AttachmentUploader
                attachments={currentEmployee.attachments || []}
                onUpload={(files) => handleUploadAttachment(currentEmployee.id, files)}
                onDelete={(id) => handleDeleteAttachment(currentEmployee.id, id)}
              />
            </TabsContent>
          </Tabs>
        </CrudModal>
      )}

      {currentEmployee && (
        <CrudModal
          open={isPrintModalOpen}
          onOpenChange={setIsPrintModalOpen}
          title="Print Employee Report"
          onSubmit={() => setIsPrintModalOpen(false)}
          submitLabel="Close"
          size="xl"
        >
          <PrintTemplate
            title={`Employee: ${currentEmployee.name}`}
            headerContent={
              <div>
                <div className="text-2xl font-bold">TWIST ERP</div>
                <div className="text-lg">Employee Report</div>
                <div className="text-sm text-gray-600">Generated: {formatDateTime(new Date())}</div>
              </div>
            }
            footerContent={
              <div className="flex justify-between items-center text-xs">
                <div>TWIST ERP System - HR Management</div>
                <div>Page 1 of 1</div>
              </div>
            }
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">Employee ID</div>
                  <div className="text-base">{currentEmployee.employeeId}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Full Name</div>
                  <div className="text-base">{currentEmployee.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Email</div>
                  <div className="text-base">{currentEmployee.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Phone</div>
                  <div className="text-base">{currentEmployee.phone}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Position</div>
                  <div className="text-base">{currentEmployee.position}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Department</div>
                  <div className="text-base">{currentEmployee.department}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Branch</div>
                  <div className="text-base">{currentEmployee.branch}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Status</div>
                  <div className="text-base capitalize">{currentEmployee.status}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Hire Date</div>
                  <div className="text-base">{formatDate(currentEmployee.hireDate)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Salary</div>
                  <div className="text-base">${currentEmployee.salary.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </PrintTemplate>
        </CrudModal>
      )}

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        description={`Are you sure you want to delete ${currentEmployee?.name}? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </ErpLayout>
  )
}
