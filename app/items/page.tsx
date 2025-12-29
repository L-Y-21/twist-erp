"use client"

import type React from "react"
import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable, SortableHeader } from "@/components/data-table"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { itemsApi, type Item } from "@/lib/api/items"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { simulateApi } from "@/lib/api/simulation"

export default function ItemsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    categoryId: "",
    unitId: "",
    reorderLevel: 10,
    minStockLevel: 5,
    maxStockLevel: 100,
    isActive: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const data = await simulateApi.inventory.getAll()
    setItems(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      await simulateApi.inventory.update(editingItem.id, formData)
      toast({ title: "Success", description: "Simulated: Item updated" })
    } else {
      await simulateApi.inventory.create(formData)
      toast({ title: "Success", description: "Simulated: Item created" })
    }
    setIsDialogOpen(false)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    try {
      await itemsApi.delete(id)
      toast({ title: "Success", description: "Item deleted successfully" })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      code: item.code,
      description: item.description || "",
      categoryId: item.categoryId,
      unitId: item.unitId,
      reorderLevel: item.reorderLevel,
      minStockLevel: item.minStockLevel,
      maxStockLevel: item.maxStockLevel,
      isActive: item.isActive,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      name: "",
      code: "",
      description: "",
      categoryId: "",
      unitId: "",
      reorderLevel: 10,
      minStockLevel: 5,
      maxStockLevel: 100,
      isActive: true,
    })
  }

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => <SortableHeader column={column}>Item Code</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("code")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Item Name</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => {
        const category = categories.find((c) => c.id === row.getValue("categoryId"))
        return <Badge variant="outline">{category?.name || "N/A"}</Badge>
      },
    },
    {
      accessorKey: "unitId",
      header: "Unit",
      cell: ({ row }) => {
        const unit = units.find((u) => u.id === row.getValue("unitId"))
        return <span className="text-muted-foreground">{unit?.abbreviation || "N/A"}</span>
      },
    },
    {
      accessorKey: "reorderLevel",
      header: "Reorder Level",
      cell: ({ row }) => <span>{row.getValue("reorderLevel")}</span>,
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
      header: "Actions",
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
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight">Inventory</h1>
            <p className="text-muted-foreground">Comprehensive stock management and simulation</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
            className="h-11 px-6"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
        </div>

        {/* Simulated Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Stock Value", value: "$124,500.00", sub: "+12.5% from last month" },
            { label: "Low Stock Items", value: "8", sub: "Requires immediate attention" },
            { label: "Pending Issues", value: "3", sub: "2 orders in processing" },
          ].map((stat, i) => (
            <Card key={i} className="p-6 bg-card border-border/50 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{stat.label}</p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-xs text-primary mt-2">{stat.sub}</p>
            </Card>
          ))}
        </div>

        <Card className="border-border/50 shadow-sm overflow-hidden">
          <DataTable columns={columns} data={items} />
        </Card>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={resetForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the item details below" : "Fill in the details to create a new item"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Item Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <Select
                    value={formData.unitId}
                    onValueChange={(value) => setFormData({ ...formData, unitId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name} ({unit.abbreviation})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reorderLevel">Reorder Level</Label>
                  <Input
                    id="reorderLevel"
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStock">Max Stock</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    value={formData.maxStockLevel}
                    onChange={(e) => setFormData({ ...formData, maxStockLevel: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingItem ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ErpLayout>
  )
}
