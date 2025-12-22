"use client"

import { useState } from "react"
import ErpLayout from "@/components/erp-layout"
import { navigationConfig } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  Shield,
  Key,
  Building2,
  Mail,
  Phone,
  Printer,
  CheckCircle2,
  XCircle,
  MoreVertical,
} from "lucide-react"
import { toast } from "sonner"
import CrudModal from "@/components/crud-modal"
import DeleteDialog from "@/components/delete-dialog"
import FormFieldWrapper from "@/components/form-field-wrapper"
import PermissionGuard from "@/components/permission-guard"
import ViewSwitcher from "@/components/view-switcher"
import GridCard from "@/components/grid-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PrintTemplate } from "@/components/print-template"
import { generateId, simulateDelay, formatDateTime } from "@/lib/utils"

const ALL_PERMISSIONS = {
  Dashboard: ["dashboard.view", "dashboard.create", "dashboard.edit", "dashboard.delete"],
  "User Management": ["users.view", "users.create", "users.edit", "users.delete"],
  Roles: ["roles.view", "roles.create", "roles.edit", "roles.delete"],
  Projects: ["projects.view", "projects.create", "projects.edit", "projects.delete"],
  "Project Orders": ["project-orders.view", "project-orders.create", "project-orders.edit", "project-orders.delete"],
  Tasks: ["tasks.view", "tasks.create", "tasks.edit", "tasks.delete"],
  Fleet: ["fleet.view", "fleet.create", "fleet.edit", "fleet.delete"],
  Vehicles: ["vehicles.view", "vehicles.create", "vehicles.edit", "vehicles.delete"],
  Drivers: ["drivers.view", "drivers.create", "drivers.edit", "drivers.delete"],
  "Fuel Logs": ["fuel-logs.view", "fuel-logs.create", "fuel-logs.edit", "fuel-logs.delete"],
  "Trip Orders": ["trip-orders.view", "trip-orders.create", "trip-orders.edit", "trip-orders.delete"],
  Inventory: ["inventory.view", "inventory.create", "inventory.edit", "inventory.delete"],
  Items: ["items.view", "items.create", "items.edit", "items.delete"],
  Categories: ["categories.view", "categories.create", "categories.edit", "categories.delete"],
  Stores: ["stores.view", "stores.create", "stores.edit", "stores.delete"],
  "Stock Movements": [
    "stock-movements.view",
    "stock-movements.create",
    "stock-movements.edit",
    "stock-movements.delete",
  ],
  "Goods Receiving": [
    "goods-receiving.view",
    "goods-receiving.create",
    "goods-receiving.edit",
    "goods-receiving.delete",
  ],
  Properties: ["properties.view", "properties.create", "properties.edit", "properties.delete"],
  Units: ["units.view", "units.create", "units.edit", "units.delete"],
  Service: ["service.view", "service.create", "service.edit", "service.delete"],
  "Work Orders": ["work-orders.view", "work-orders.create", "work-orders.edit", "work-orders.delete"],
  Leases: ["leases.view", "leases.create", "leases.edit", "leases.delete"],
  "Service Requests": [
    "service-requests.view",
    "service-requests.create",
    "service-requests.edit",
    "service-requests.delete",
  ],
  "Preventive Maintenance": ["preventive.view", "preventive.create", "preventive.edit", "preventive.delete"],
  HR: ["hr.view", "hr.create", "hr.edit", "hr.delete"],
  Employees: ["employees.view", "employees.create", "employees.edit", "employees.delete"],
  Attendance: ["attendance.view", "attendance.create", "attendance.edit", "attendance.delete"],
  Leaves: ["leaves.view", "leaves.create", "leaves.edit", "leaves.delete"],
  Payroll: ["payroll.view", "payroll.create", "payroll.edit", "payroll.delete"],
  Finance: ["finance.view", "finance.create", "finance.edit", "finance.delete"],
  Invoices: ["invoices.view", "invoices.create", "invoices.edit", "invoices.delete"],
  Expenses: ["expenses.view", "expenses.create", "expenses.edit", "expenses.delete"],
  Payments: ["payments.view", "payments.create", "payments.edit", "payments.delete"],
  Settings: ["settings.view", "settings.edit"],
  Company: ["company.view", "company.edit"],
  Numbering: ["numbering.view", "numbering.edit"],
  Workflows: ["workflows.view", "workflows.edit"],
  Audit: ["audit.view"],
}

const ALL_MODULES = [
  "dashboard",
  "projects",
  "project-orders",
  "tasks",
  "fleet",
  "vehicles",
  "drivers",
  "fuel-logs",
  "trip-orders",
  "inventory",
  "items",
  "categories",
  "stores",
  "stock-movements",
  "goods-receiving",
  "properties",
  "units",
  "service",
  "work-orders",
  "leases",
  "service-requests",
  "preventive",
  "hr",
  "employees",
  "attendance",
  "leaves",
  "payroll",
  "finance",
  "invoices",
  "expenses",
  "payments",
  "settings",
  "users",
  "roles",
  "company",
  "numbering",
  "workflows",
  "audit",
]

const mockUsers = [
  {
    id: "1",
    username: "admin",
    password: "123456",
    name: "System Administrator",
    email: "admin@twisterp.com",
    phone: "+1234567890",
    role: "Administrator",
    branch: "Main Office",
    status: "active",
    userType: "system",
    permissions: Object.values(ALL_PERMISSIONS).flat(),
    licensedModules: ALL_MODULES,
    createdAt: new Date("2024-01-01"),
    attachments: [],
  },
  {
    id: "2",
    username: "manager",
    password: "123456",
    name: "Project Manager",
    email: "manager@twisterp.com",
    phone: "+1234567891",
    role: "Manager",
    branch: "Site A",
    status: "active",
    userType: "system",
    permissions: [
      "dashboard.view",
      "projects.view",
      "projects.create",
      "projects.edit",
      "tasks.view",
      "tasks.create",
      "tasks.edit",
    ],
    licensedModules: ["dashboard", "projects", "project-orders", "tasks"],
    createdAt: new Date("2024-02-01"),
    attachments: [],
  },
  {
    id: "3",
    username: "john.doe",
    password: "123456",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567892",
    role: "Employee",
    branch: "Main Office",
    status: "active",
    userType: "regular",
    permissions: [],
    licensedModules: [],
    createdAt: new Date("2024-01-15"),
    attachments: [],
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<"grid" | "table">("table")

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    branch: "",
    status: "active" as "active" | "inactive",
    userType: "regular" as "system" | "regular",
    permissions: [] as string[],
    licensedModules: [] as string[],
  })

  const roles = ["Administrator", "Manager", "Supervisor", "Employee", "Accountant"]
  const branches = ["Main Office", "Site A", "Site B", "Warehouse 1", "Warehouse 2"]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesType = filterType === "all" || user.userType === filterType
    return matchesSearch && matchesRole && matchesType
  })

  const handleAdd = () => {
    setFormData({
      username: "",
      password: "",
      name: "",
      email: "",
      phone: "",
      role: "",
      branch: "",
      status: "active",
      userType: "regular",
      permissions: [],
      licensedModules: [],
    })
    setIsAddModalOpen(true)
  }

  const handleEdit = (user: any) => {
    setCurrentUser(user)
    setFormData({
      username: user.username || "",
      password: "",
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      branch: user.branch || "",
      status: user.status,
      userType: user.userType || "regular",
      permissions: user.permissions || [],
      licensedModules: user.licensedModules || [],
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (user: any) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handlePrint = (user) => {
    setCurrentUser(user)
    setIsPrintModalOpen(true)
  }

  const handlePrintAll = () => {
    // Implement print all functionality here
  }

  const handleSubmitAdd = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.userType === "system" && (!formData.username || !formData.password)) {
      toast.error("System users require username and password")
      return
    }

    setIsLoading(true)
    await simulateDelay(1000)

    const newUser = {
      id: generateId(),
      ...formData,
      createdAt: new Date(),
      attachments: [],
    }

    setUsers([newUser, ...users])
    setIsAddModalOpen(false)
    setIsLoading(false)
    toast.success("User added successfully")
  }

  const handleSubmitEdit = async () => {
    if (!currentUser) return

    setIsLoading(true)
    await simulateDelay(1000)

    setUsers(
      users.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              ...formData,
              password: formData.password || u.password, // Keep existing password if not changed
            }
          : u,
      ),
    )
    setIsEditModalOpen(false)
    setIsLoading(false)
    setCurrentUser(null)
    toast.success("User updated successfully")
  }

  const handleConfirmDelete = async () => {
    if (!currentUser) return

    setIsLoading(true)
    await simulateDelay(1000)

    setUsers(users.filter((u) => u.id !== currentUser.id))
    setIsDeleteDialogOpen(false)
    setIsLoading(false)
    setCurrentUser(null)
    toast.success("User deleted successfully")
  }

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return

    setIsLoading(true)
    await simulateDelay(1000)

    setUsers(users.filter((u) => !selectedUsers.includes(u.id)))
    setSelectedUsers([])
    setIsLoading(false)
    toast.success(`${selectedUsers.length} users deleted successfully`)
  }

  const handleUploadAttachment = (userId, files) => {
    const newAttachments = Array.from(files).map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
      uploadedBy: "Current User",
    }))

    setUsers(
      users.map((u) => (u.id === userId ? { ...u, attachments: [...(u.attachments || []), ...newAttachments] } : u)),
    )
    toast.success("Attachment(s) uploaded successfully")
  }

  const handleDeleteAttachment = (userId, attachmentId) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, attachments: u.attachments?.filter((a) => a.id !== attachmentId) } : u,
      ),
    )
    toast.success("Attachment deleted successfully")
  }

  const togglePermission = (permission: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(permission)
        ? formData.permissions.filter((p) => p !== permission)
        : [...formData.permissions, permission],
    })
  }

  const toggleModule = (module: string) => {
    setFormData({
      ...formData,
      licensedModules: formData.licensedModules.includes(module)
        ? formData.licensedModules.filter((m) => m !== module)
        : [...formData.licensedModules, module],
    })
  }

  const selectAllPermissions = () => {
    setFormData({
      ...formData,
      permissions: Object.values(ALL_PERMISSIONS).flat(),
    })
  }

  const clearAllPermissions = () => {
    setFormData({
      ...formData,
      permissions: [],
    })
  }

  const selectAllModules = () => {
    setFormData({
      ...formData,
      licensedModules: ALL_MODULES,
    })
  }

  const clearAllModules = () => {
    setFormData({
      ...formData,
      licensedModules: [],
    })
  }

  return (
    <PermissionGuard module="users" action="view">
      <ErpLayout navigation={navigationConfig} title="User Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground mt-1">Manage system users, permissions, and module licenses</p>
            </div>
            <PermissionGuard module="users" action="create">
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </PermissionGuard>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="system">System Users</SelectItem>
                    <SelectItem value="regular">Regular Users</SelectItem>
                  </SelectContent>
                </Select>
                <ViewSwitcher view={view} onViewChange={setView} />
              </div>
              {selectedUsers.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary">{selectedUsers.length} selected</Badge>
                  <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Users Display */}
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <GridCard
                  key={user.id}
                  title={user.name}
                  subtitle={user.email}
                  badges={[
                    { label: user.role, variant: "default" },
                    {
                      label: user.userType === "system" ? "System User" : "Regular User",
                      variant: user.userType === "system" ? "secondary" : "outline",
                    },
                    {
                      label: user.status,
                      variant: user.status === "active" ? "default" : "secondary",
                    },
                  ]}
                  metadata={[
                    { icon: Users, label: user.username || "N/A" },
                    { icon: Building2, label: user.branch || "N/A" },
                    { icon: Shield, label: `${user.permissions?.length || 0} Permissions` },
                    { icon: Key, label: `${user.licensedModules?.length || 0} Modules` },
                  ]}
                  onEdit={() => handleEdit(user)}
                  onDelete={() => handleDelete(user)}
                  canEdit={true}
                  canDelete={true}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-4 text-left">
                          <Checkbox
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onCheckedChange={(checked) => {
                              setSelectedUsers(checked ? filteredUsers.map((u) => u.id) : [])
                            }}
                          />
                        </th>
                        <th className="p-4 text-left font-medium">Name</th>
                        <th className="p-4 text-left font-medium">Username</th>
                        <th className="p-4 text-left font-medium">Email</th>
                        <th className="p-4 text-left font-medium">Role</th>
                        <th className="p-4 text-left font-medium">Type</th>
                        <th className="p-4 text-left font-medium">Branch</th>
                        <th className="p-4 text-left font-medium">Status</th>
                        <th className="p-4 text-left font-medium">Permissions</th>
                        <th className="p-4 text-left font-medium">Modules</th>
                        <th className="p-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={(checked) => {
                                setSelectedUsers(
                                  checked ? [...selectedUsers, user.id] : selectedUsers.filter((id) => id !== user.id),
                                )
                              }}
                            />
                          </td>
                          <td className="p-4 font-medium">
                            <div className="flex items-center gap-2">
                              {user.name}
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {user.phone}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">{user.username || "-"}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{user.role}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant={user.userType === "system" ? "secondary" : "outline"}>
                              {user.userType === "system" ? "System" : "Regular"}
                            </Badge>
                          </td>
                          <td className="p-4">{user.branch || "-"}</td>
                          <td className="p-4">
                            <Badge variant={user.status === "active" ? "default" : "secondary"}>
                              {user.status === "active" ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4">{user.permissions?.length || 0}</td>
                          <td className="p-4">{user.licensedModules?.length || 0}</td>
                          <td className="p-4">
                            <div className="flex justify-end gap-2">
                              <PermissionGuard module="users" action="edit">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>
                              <PermissionGuard module="users" action="delete">
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(user)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(user)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handlePrint(user)}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(user)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add Modal */}
        <CrudModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New User"
          onSubmit={handleSubmitAdd}
          isLoading={isLoading}
          submitLabel="Add User"
          size="xl"
        >
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="licenses">Module Licenses</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <FormFieldWrapper label="User Type" required>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) => setFormData({ ...formData, userType: value as "system" | "regular" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular User</SelectItem>
                      <SelectItem value="system">System User (with login access)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>

                {formData.userType === "system" && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormFieldWrapper label="Username" required>
                        <Input
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          placeholder="username"
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper label="Password" required>
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="••••••"
                        />
                      </FormFieldWrapper>
                    </div>
                  </>
                )}

                <FormFieldWrapper label="Full Name" required>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </FormFieldWrapper>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormFieldWrapper label="Email" required>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper label="Phone">
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1234567890"
                    />
                  </FormFieldWrapper>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormFieldWrapper label="Role" required>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                  <FormFieldWrapper label="Branch">
                    <Select
                      value={formData.branch}
                      onValueChange={(value) => setFormData({ ...formData, branch: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                </div>

                <FormFieldWrapper label="Status">
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Selected: {formData.permissions.length} / {Object.values(ALL_PERMISSIONS).flat().length}
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={selectAllPermissions}>
                    Select All
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={clearAllPermissions}>
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                {Object.entries(ALL_PERMISSIONS).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-semibold text-sm">{category}</h4>
                    <div className="grid grid-cols-2 gap-2 pl-4">
                      {permissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission}
                            checked={formData.permissions.includes(permission)}
                            onCheckedChange={() => togglePermission(permission)}
                          />
                          <Label htmlFor={permission} className="text-sm cursor-pointer">
                            {permission.split(".")[1]}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="licenses" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Selected: {formData.licensedModules.length} / {ALL_MODULES.length}
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={selectAllModules}>
                    Select All
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={clearAllModules}>
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto border rounded-lg p-4">
                {ALL_MODULES.map((module) => (
                  <div key={module} className="flex items-center space-x-2">
                    <Checkbox
                      id={`module-${module}`}
                      checked={formData.licensedModules.includes(module)}
                      onCheckedChange={() => toggleModule(module)}
                    />
                    <Label htmlFor={`module-${module}`} className="text-sm cursor-pointer capitalize">
                      {module.replace(/-/g, " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CrudModal>

        {/* Edit Modal */}
        <CrudModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit User"
          onSubmit={handleSubmitEdit}
          isLoading={isLoading}
          submitLabel="Save Changes"
          size="xl"
        >
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="licenses">Module Licenses</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <FormFieldWrapper label="User Type" required>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) => setFormData({ ...formData, userType: value as "system" | "regular" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular User</SelectItem>
                      <SelectItem value="system">System User (with login access)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>

                {formData.userType === "system" && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormFieldWrapper label="Username" required>
                        <Input
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          placeholder="username"
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper label="New Password (leave blank to keep current)">
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="••••••"
                        />
                      </FormFieldWrapper>
                    </div>
                  </>
                )}

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
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </FormFieldWrapper>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormFieldWrapper label="Role" required>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                  <FormFieldWrapper label="Branch">
                    <Select
                      value={formData.branch}
                      onValueChange={(value) => setFormData({ ...formData, branch: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                </div>

                <FormFieldWrapper label="Status">
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Selected: {formData.permissions.length} / {Object.values(ALL_PERMISSIONS).flat().length}
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={selectAllPermissions}>
                    Select All
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={clearAllPermissions}>
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                {Object.entries(ALL_PERMISSIONS).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-semibold text-sm">{category}</h4>
                    <div className="grid grid-cols-2 gap-2 pl-4">
                      {permissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${permission}`}
                            checked={formData.permissions.includes(permission)}
                            onCheckedChange={() => togglePermission(permission)}
                          />
                          <Label htmlFor={`edit-${permission}`} className="text-sm cursor-pointer">
                            {permission.split(".")[1]}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="licenses" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Selected: {formData.licensedModules.length} / {ALL_MODULES.length}
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={selectAllModules}>
                    Select All
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={clearAllModules}>
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto border rounded-lg p-4">
                {ALL_MODULES.map((module) => (
                  <div key={module} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-module-${module}`}
                      checked={formData.licensedModules.includes(module)}
                      onCheckedChange={() => toggleModule(module)}
                    />
                    <Label htmlFor={`edit-module-${module}`} className="text-sm cursor-pointer capitalize">
                      {module.replace(/-/g, " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CrudModal>

        {/* Print Modal */}
        {currentUser && (
          <CrudModal
            open={isPrintModalOpen}
            onOpenChange={setIsPrintModalOpen}
            title="Print User Information"
            onSubmit={() => setIsPrintModalOpen(false)}
            submitLabel="Close"
            size="xl"
          >
            <PrintTemplate
              title={`User: ${currentUser.name}`}
              headerContent={
                <div>
                  <div className="text-2xl font-bold">TWIST ERP</div>
                  <div className="text-lg">User Information Report</div>
                  <div className="text-sm text-gray-600">Generated: {formatDateTime(new Date())}</div>
                </div>
              }
              footerContent={
                <div className="flex justify-between items-center text-xs">
                  <div>TWIST ERP System - User Management</div>
                  <div>Page 1 of 1</div>
                </div>
              }
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Name</div>
                    <div className="text-base">{currentUser.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Email</div>
                    <div className="text-base">{currentUser.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Phone</div>
                    <div className="text-base">{currentUser.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Role</div>
                    <div className="text-base">{currentUser.role}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Branch</div>
                    <div className="text-base">{currentUser.branch}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Status</div>
                    <div className="text-base capitalize">{currentUser.status}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Created</div>
                    <div className="text-base">{formatDateTime(currentUser.createdAt)}</div>
                  </div>
                </div>

                {currentUser.attachments && currentUser.attachments.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Attachments</div>
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-sm">File Name</th>
                          <th className="text-left text-sm">Uploaded By</th>
                          <th className="text-left text-sm">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUser.attachments.map((att) => (
                          <tr key={att.id}>
                            <td className="text-sm">{att.name}</td>
                            <td className="text-sm">{att.uploadedBy}</td>
                            <td className="text-sm">{formatDateTime(att.uploadedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </PrintTemplate>
          </CrudModal>
        )}

        {/* Delete Dialog */}
        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete User"
          description={`Are you sure you want to delete ${currentUser?.name}? This action cannot be undone.`}
          isLoading={isLoading}
        />
      </ErpLayout>
    </PermissionGuard>
  )
}
