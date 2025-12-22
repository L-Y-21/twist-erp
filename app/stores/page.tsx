"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DataTable, SortableHeader } from "@/components/data-table"
import { FormDialog } from "@/components/form-dialog"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { DeleteDialog } from "@/components/delete-dialog"
import { Plus, Warehouse, MapPin } from "lucide-react"

// Mock Data for Stores
interface Store {
  id: string
  name: string
  location: string
  manager: string
  capacity: string
  status: "Active" | "Inactive"
}

const mockStores: Store[] = [
  { id: "STR-001", name: "Main Warehouse", location: "Industrial Zone A", manager: "John Doe", capacity: "85%", status: "Active" },
  { id: "STR-002", name: "Site A Store", location: "Downtown Project Site", manager: "Jane Smith", capacity: "45%", status: "Active" },
  { id: "STR-003", name: "Tools Depot", location: "HQ Basement", manager: "Mike Johnson", capacity: "92%", status: "Active" },
]

export default function StoresPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [stores, setStores] = useState<Store[]>(mockStores)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [currentStore, setCurrentStore] = useState<Store | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<Partial<Store>>({})

  const handleDelete = (store: Store) => {
    setStoreToDelete(store.id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (storeToDelete) {
      setIsLoading(true)
      setTimeout(() => {
        setStores(stores.filter((s) => s.id !== storeToDelete))
        setIsLoading(false)
        setDeleteDialogOpen(false)
        setStoreToDelete(null)
        toast({
          title: "Store Deleted",
          description: "The store has been successfully deleted.",
        })
      }, 500)
    }
  }

  const handleEdit = (store: Store) => {
    setCurrentStore(store)
    setFormData(store)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setCurrentStore(null)
    setFormData({
      id: `STR-00${Math.floor(Math.random() * 100) + 4}`,
      status: "Active",
    })
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.location) {
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
        setStores([...stores, formData as Store])
        toast({ title: "Store Created", description: "New store added successfully." })
      } else {
        setStores(stores.map(s => s.id === currentStore?.id ? (formData as Store) : s))
        toast({ title: "Store Updated", description: "Store details have been updated." })
      }
      setIsLoading(false)
      setDialogOpen(false)
    }, 500)
  }

  const columns: ColumnDef<Store>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column}>Store ID</SortableHeader>,
      cell: ({ row }) => <span className="font-medium text-primary">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Store Name</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Warehouse className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-foreground/80">
          <MapPin className="h-3 w-3" />
          <span>{row.getValue("location")}</span>
        </div>
      ),
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: ({ row }) => <span className="text-foreground">{row.getValue("manager")}</span>,
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }) => <span className="font-medium text-foreground">{row.getValue("capacity")}</span>,
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
            <h1 className="text-2xl font-bold tracking-tight">Stores & Warehouses</h1>
            <p className="text-muted-foreground">Manage storage locations and inventory distribution</p>
          </div>
          <Button onClick={handleCreate} className="shadow-lg hover:shadow-xl transition-all">
            <Plus className="h-4 w-4 mr-2" />
            New Store
          </Button>
        </div>

        <Card className="p-0 border-none shadow-sm bg-transparent">
          <DataTable
            columns={columns}
            data={stores}
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
        title={dialogMode === "create" ? "New Store" : `Edit: ${currentStore?.name}`}
        onSave={handleSave}
        isSaving={isLoading}
        maxWidth="2xl"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Store Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Main Warehouse"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location/Address <span className="text-destructive">*</span></Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. 123 Industrial Ave"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="manager">Store Manager</Label>
              <Input
                id="manager"
                value={formData.manager || ""}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Notes / Description</Label>
              <Textarea
                id="description"
                className="min-h-[120px]"
                placeholder="Additional details about this store..."
              />
            </div>
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Store"
        description="Are you sure you want to delete this store? This action cannot be undone."
      />
    </ErpLayout>
  )
}
