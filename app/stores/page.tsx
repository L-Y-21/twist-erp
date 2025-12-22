"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ViewSwitcher } from "@/components/view-switcher"
import { DataTable, SortableHeader } from "@/components/data-table"
import { Plus, Edit, Trash2, WarehouseIcon, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { warehousesApi } from "@/lib/api/warehouses"

export default function StoresPage() {
  const { toast } = useToast()
  const [warehouses, setWarehouses] = useState([])
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
    isActive: true,
  })

  useEffect(() => {
    loadWarehouses()
  }, [])

  const loadWarehouses = async () => {
    try {
      setLoading(true)
      const data = await warehousesApi.getAll()
      setWarehouses(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load warehouses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingWarehouse) {
        await warehousesApi.update(editingWarehouse.id, formData)
        toast({ title: "Success", description: "Warehouse updated successfully" })
      } else {
        await warehousesApi.create(formData)
        toast({ title: "Success", description: "Warehouse created successfully" })
      }
      setIsDialogOpen(false)
      resetForm()
      loadWarehouses()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save warehouse",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this warehouse?")) return
    try {
      await warehousesApi.delete(id)
      toast({ title: "Success", description: "Warehouse deleted successfully" })
      loadWarehouses()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete warehouse",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse)
    setFormData({
      name: warehouse.name,
      code: warehouse.code,
      location: warehouse.location,
      isActive: warehouse.isActive,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingWarehouse(null)
    setFormData({
      name: "",
      code: "",
      location: "",
      isActive: true,
    })
  }

  const filteredWarehouses = warehouses.filter(
    (wh) =>
      wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const columns = [
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
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive")
        return <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Store
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{editingWarehouse ? "Edit Warehouse" : "Add New Warehouse"}</DialogTitle>
                    <DialogDescription>
                      {editingWarehouse
                        ? "Update the warehouse details below"
                        : "Fill in the details to create a new warehouse"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Code *</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingWarehouse ? "Update" : "Create"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Stores</div>
            <div className="text-2xl font-bold">{warehouses.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active Stores</div>
            <div className="text-2xl font-bold">{warehouses.filter((w) => w.isActive).length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Locations</div>
            <div className="text-2xl font-bold">{new Set(warehouses.map((w) => w.location)).size}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Inactive</div>
            <div className="text-2xl font-bold">{warehouses.filter((w) => !w.isActive).length}</div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search warehouses..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {viewMode === "list" ? (
            loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <DataTable columns={columns} data={filteredWarehouses} />
            )
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-full text-center py-8">Loading...</div>
              ) : filteredWarehouses.length === 0 ? (
                <div className="col-span-full text-center py-8">No warehouses found</div>
              ) : (
                filteredWarehouses.map((warehouse) => (
                  <Card key={warehouse.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                          <WarehouseIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{warehouse.name}</h3>
                          <p className="text-sm text-muted-foreground">{warehouse.code}</p>
                        </div>
                      </div>
                      <Badge variant={warehouse.isActive ? "default" : "secondary"}>
                        {warehouse.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Location: </span>
                        {warehouse.location}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(warehouse)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(warehouse.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    </ErpLayout>
  )
}
