"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CrudModal } from "@/components/crud-modal"
import { DeleteDialog } from "@/components/delete-dialog"
import { ViewSwitcher } from "@/components/view-switcher"
import { GridCard } from "@/components/grid-card"
import { DataTable, SortableHeader } from "@/components/data-table"
import { Plus, Edit, Trash2, Warehouse } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"

interface Store {
  id: string
  code: string
  name: string
  location: string
  type: "Main" | "Branch" | "Site"
  manager: string
  status: "Active" | "Inactive"
  capacity: number
  currentStock: number
}

const mockStores: Store[] = [
  {
    id: "1",
    code: "ST-001",
    name: "Main Warehouse",
    location: "Industrial Zone A",
    type: "Main",
    manager: "John Doe",
    status: "Active",
    capacity: 10000,
    currentStock: 7500,
  },
  {
    id: "2",
    code: "ST-002",
    name: "Downtown Branch",
    location: "City Center",
    type: "Branch",
    manager: "Jane Smith",
    status: "Active",
    capacity: 5000,
    currentStock: 3200,
  },
  {
    id: "3",
    code: "ST-003",
    name: "Site Store - Tower Project",
    location: "Tower Construction Site",
    type: "Site",
    manager: "Mike Johnson",
    status: "Active",
    capacity: 2000,
    currentStock: 1800,
  },
]

export default function StoresPage() {
  const { toast } = useToast()
  const [stores, setStores] = useState<Store[]>(mockStores)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null)

  const handleSave = (data: any) => {
    if (editingStore) {
      setStores(stores.map((s) => (s.id === editingStore.id ? { ...s, ...data } : s)))
      toast({ title: "Store Updated", description: "Store has been updated successfully." })
    } else {
      const newStore: Store = { id: Date.now().toString(), ...data }
      setStores([...stores, newStore])
      toast({ title: "Store Created", description: "New store has been created successfully." })
    }
    setIsModalOpen(false)
    setEditingStore(null)
  }

  const handleEdit = (store: Store) => {
    setEditingStore(store)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setStores(stores.filter((s) => s.id !== id))
    toast({ title: "Store Deleted", description: "Store has been deleted successfully." })
  }

  const columns: ColumnDef<Store>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => <SortableHeader column={column}>Code</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("code")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Store Name</SortableHeader>,
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
    },
    {
      accessorKey: "manager",
      header: "Manager",
    },
    {
      accessorKey: "currentStock",
      header: "Utilization",
      cell: ({ row }) => {
        const current = row.original.currentStock
        const capacity = row.original.capacity
        const percentage = (current / capacity) * 100
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
            </div>
            <span className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <Badge variant={status === "Active" ? "default" : "secondary"}>{status}</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setStoreToDelete(row.original.id)
              setDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const formFields = [
    { name: "code", label: "Store Code", type: "text" as const, required: true },
    { name: "name", label: "Store Name", type: "text" as const, required: true },
    { name: "location", label: "Location", type: "text" as const, required: true },
    {
      name: "type",
      label: "Type",
      type: "select" as const,
      options: ["Main", "Branch", "Site"],
      required: true,
    },
    { name: "manager", label: "Manager", type: "text" as const, required: true },
    { name: "capacity", label: "Capacity", type: "number" as const, required: true },
    { name: "currentStock", label: "Current Stock", type: "number" as const, required: true },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      options: ["Active", "Inactive"],
      required: true,
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Stores / Warehouses</h1>
            <p className="text-muted-foreground">Manage storage locations</p>
          </div>
          <div className="flex gap-2">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Store
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Stores</div>
            <div className="text-2xl font-bold">{stores.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active Stores</div>
            <div className="text-2xl font-bold">{stores.filter((s) => s.status === "Active").length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Capacity</div>
            <div className="text-2xl font-bold">{stores.reduce((sum, s) => sum + s.capacity, 0).toLocaleString()}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Current Stock</div>
            <div className="text-2xl font-bold">
              {stores.reduce((sum, s) => sum + s.currentStock, 0).toLocaleString()}
            </div>
          </Card>
        </div>

        {viewMode === "list" ? (
          <Card className="p-6">
            <DataTable columns={columns} data={stores} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <GridCard
                key={store.id}
                icon={<Warehouse className="h-5 w-5" />}
                title={store.name}
                subtitle={store.code}
                status={store.status}
                fields={[
                  { label: "Location", value: store.location },
                  { label: "Type", value: store.type },
                  { label: "Manager", value: store.manager },
                  {
                    label: "Utilization",
                    value: `${((store.currentStock / store.capacity) * 100).toFixed(0)}%`,
                  },
                ]}
                onEdit={() => handleEdit(store)}
                onDelete={() => {
                  setStoreToDelete(store.id)
                  setDeleteDialogOpen(true)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingStore(null)
        }}
        onSave={handleSave}
        title={editingStore ? "Edit Store" : "Add Store"}
        fields={formFields}
        initialData={editingStore || undefined}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (storeToDelete) handleDelete(storeToDelete)
          setDeleteDialogOpen(false)
        }}
        title="Delete Store"
        description="Are you sure you want to delete this store? This action cannot be undone."
      />
    </ErpLayout>
  )
}
