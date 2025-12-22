"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable, SortableHeader } from "@/components/data-table"
import { FormDialog } from "@/components/form-dialog"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { DeleteDialog } from "@/components/delete-dialog"
import { Plus, User, Mail, Shield } from "lucide-react"

// Mock Data for Users
interface UserData {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: "Active" | "Inactive"
}

const mockUsers: UserData[] = [
  { id: "USR-001", name: "Admin User", email: "admin@twist.com", role: "Administrator", department: "IT", status: "Active" },
  { id: "USR-002", name: "John Smith", email: "john@twist.com", role: "Project Manager", department: "Operations", status: "Active" },
  { id: "USR-003", name: "Sarah Connor", email: "sarah@twist.com", role: "Store Manager", department: "Inventory", status: "Active" },
]

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [users, setUsers] = useState<UserData[]>(mockUsers)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<Partial<UserData>>({})

  const handleDelete = (user: UserData) => {
    setUserToDelete(user.id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      setIsLoading(true)
      setTimeout(() => {
        setUsers(users.filter((u) => u.id !== userToDelete))
        setIsLoading(false)
        setDeleteDialogOpen(false)
        setUserToDelete(null)
        toast({
          title: "User Deleted",
          description: "The user has been successfully deleted.",
        })
      }, 500)
    }
  }

  const handleEdit = (user: UserData) => {
    setCurrentUser(user)
    setFormData(user)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setCurrentUser(null)
    setFormData({
      id: `USR-00${Math.floor(Math.random() * 100) + 4}`,
      status: "Active",
    })
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.role) {
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
        setUsers([...users, formData as UserData])
        toast({ title: "User Created", description: "New user added successfully." })
      } else {
        setUsers(users.map(u => u.id === currentUser?.id ? (formData as UserData) : u))
        toast({ title: "User Updated", description: "User details have been updated." })
      }
      setIsLoading(false)
      setDialogOpen(false)
    }, 500)
  }

  const columns: ColumnDef<UserData>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {row.original.name.charAt(0)}
          </div>
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-foreground/80">
          <Mail className="h-3 w-3" />
          <span>{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-foreground">
          <Shield className="h-3 w-3 text-primary" />
          <span>{row.getValue("role")}</span>
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => <span className="text-foreground">{row.getValue("department")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <span className="text-xs font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{row.getValue("status")}</span>,
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">System Users</h1>
            <p className="text-muted-foreground">Manage access and permissions</p>
          </div>
          <Button onClick={handleCreate} className="shadow-lg hover:shadow-xl transition-all">
            <Plus className="h-4 w-4 mr-2" />
            New User
          </Button>
        </div>

        <Card className="p-0 border-none shadow-sm bg-transparent">
          <DataTable
            columns={columns}
            data={users}
            searchKey="name"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleEdit}
          />
        </Card>
      </div>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogMode === "create" ? "New User" : `Edit: ${currentUser?.name}`}
        onSave={handleSave}
        isSaving={isLoading}
        maxWidth="2xl"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Smith"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. john@twist.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password {dialogMode === "edit" && "(Leave blank to keep current)"}</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role <span className="text-destructive">*</span></Label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                  <SelectItem value="Store Manager">Store Manager</SelectItem>
                  <SelectItem value="User">Standard User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(val) => setFormData({ ...formData, department: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Inventory">Inventory</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </ErpLayout>
  )
}
