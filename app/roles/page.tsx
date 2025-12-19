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
import { navigationConfig } from "@/lib/navigation"
import { Plus, Search, MoreVertical, Edit, Trash2, Shield } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { generateId, simulateDelay } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  createdAt: Date
}

const availablePermissions = [
  "Users - View",
  "Users - Create",
  "Users - Edit",
  "Users - Delete",
  "Projects - View",
  "Projects - Create",
  "Projects - Edit",
  "Projects - Delete",
  "Fleet - View",
  "Fleet - Create",
  "Fleet - Edit",
  "Fleet - Delete",
  "Inventory - View",
  "Inventory - Create",
  "Inventory - Edit",
  "Inventory - Delete",
  "Finance - View",
  "Finance - Create",
  "Finance - Edit",
  "Finance - Delete",
  "Reports - View",
  "Settings - Manage",
]

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full system access with all permissions",
    permissions: availablePermissions,
    userCount: 3,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Project Manager",
    description: "Manage projects and related resources",
    permissions: ["Projects - View", "Projects - Create", "Projects - Edit", "Fleet - View", "Reports - View"],
    userCount: 5,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    name: "Warehouse Manager",
    description: "Manage inventory and stock movements",
    permissions: ["Inventory - View", "Inventory - Create", "Inventory - Edit", "Reports - View"],
    userCount: 2,
    createdAt: new Date("2024-02-01"),
  },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  const filteredRoles = roles.filter((role) => role.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAdd = () => {
    setFormData({ name: "", description: "", permissions: [] })
    setIsAddModalOpen(true)
  }

  const handleEdit = (role: Role) => {
    setCurrentRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (role: Role) => {
    setCurrentRole(role)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmitAdd = async () => {
    if (!formData.name) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    await simulateDelay(1000)

    const newRole: Role = {
      id: generateId(),
      ...formData,
      userCount: 0,
      createdAt: new Date(),
    }

    setRoles([newRole, ...roles])
    setIsAddModalOpen(false)
    setIsLoading(false)
    toast.success("Role added successfully")
  }

  const handleSubmitEdit = async () => {
    if (!currentRole) return

    setIsLoading(true)
    await simulateDelay(1000)

    setRoles(roles.map((r) => (r.id === currentRole.id ? { ...r, ...formData } : r)))
    setIsEditModalOpen(false)
    setIsLoading(false)
    setCurrentRole(null)
    toast.success("Role updated successfully")
  }

  const handleConfirmDelete = async () => {
    if (!currentRole) return

    setIsLoading(true)
    await simulateDelay(1000)

    setRoles(roles.filter((r) => r.id !== currentRole.id))
    setIsDeleteDialogOpen(false)
    setIsLoading(false)
    setCurrentRole(null)
    toast.success("Role deleted successfully")
  }

  const togglePermission = (permission: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(permission)
        ? formData.permissions.filter((p) => p !== permission)
        : [...formData.permissions, permission],
    })
  }

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Roles & Permissions</h1>
            <p className="text-muted-foreground">Configure user roles and access permissions</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{role.name}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(role)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(role)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="secondary">{role.permissions.length} permissions</Badge>
                  <span className="text-muted-foreground">{role.userCount} users</span>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <CrudModal
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(false)
          setIsEditModalOpen(false)
        }}
        title={isAddModalOpen ? "Add New Role" : "Edit Role"}
        description="Configure role details and permissions"
        onSubmit={isAddModalOpen ? handleSubmitAdd : handleSubmitEdit}
        isLoading={isLoading}
        submitLabel={isAddModalOpen ? "Add Role" : "Save Changes"}
        size="xl"
      >
        <div className="space-y-4">
          <FormFieldWrapper label="Role Name" required>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Description">
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </FormFieldWrapper>
          <FormFieldWrapper label="Permissions" required>
            <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-3">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission}
                      checked={formData.permissions.includes(permission)}
                      onCheckedChange={() => togglePermission(permission)}
                    />
                    <label
                      htmlFor={permission}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </FormFieldWrapper>
        </div>
      </CrudModal>

      {/* Delete Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        description={`Are you sure you want to delete the role "${currentRole?.name}"? Users with this role will need to be reassigned.`}
        isLoading={isLoading}
      />
    </ErpLayout>
  )
}
