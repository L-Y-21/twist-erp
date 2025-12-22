"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable, SortableHeader } from "@/components/data-table"
import { FormDialog } from "@/components/form-dialog"
import type { ColumnDef } from "@tanstack/react-table"
import { type InventoryItem, mockInventory } from "@/lib/mock-data"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { formatCurrency } from "@/lib/utils"
import { DeleteDialog } from "@/components/delete-dialog"
import { Plus, Package, AlertCircle } from "lucide-react"

export default function ItemsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [items, setItems] = useState<InventoryItem[]>(mockInventory)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form State
  const [formData, setFormData] = useState<Partial<InventoryItem>>({})

  const handleDelete = (item: InventoryItem) => {
    setItemToDelete(item.id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      setIsLoading(true)
      setTimeout(() => {
        setItems(items.filter((item) => item.id !== itemToDelete))
        setIsLoading(false)
        setDeleteDialogOpen(false)
        setItemToDelete(null)
        toast({
          title: "Item Deleted",
          description: "The item has been successfully deleted.",
        })
      }, 500)
    }
  }

  const handleEdit = (item: InventoryItem) => {
    setCurrentItem(item)
    setFormData(item)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleView = (item: InventoryItem) => {
    handleEdit(item)
  }

  const handleCreate = () => {
    setCurrentItem(null)
    setFormData({
      id: `ITEM-${Math.floor(Math.random() * 10000)}`,
      status: "In Stock",
      quantity: 0,
      unitPrice: 0,
    })
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.category) {
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
        setItems([...items, formData as InventoryItem])
        toast({ title: "Item Created", description: "New item added to inventory." })
      } else {
        setItems(items.map(i => i.id === currentItem?.id ? (formData as InventoryItem) : i))
        toast({ title: "Item Updated", description: "Item details have been updated." })
      }
      setIsLoading(false)
      setDialogOpen(false)
    }, 500)
  }

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column}>Item Code</SortableHeader>,
      cell: ({ row }) => <span className="font-medium text-primary">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Item Name</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline" className="font-normal text-foreground bg-muted/50">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ row }) => <span className="text-foreground/70 text-xs uppercase font-medium">{row.getValue("unit")}</span>,
    },
    {
      accessorKey: "unitPrice",
      header: ({ column }) => <SortableHeader column={column}>Price</SortableHeader>,
      cell: ({ row }) => {
        const price = row.getValue("unitPrice") as number
        return <span className="font-medium text-foreground">${price.toFixed(2)}</span>
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => <SortableHeader column={column}>Stock</SortableHeader>,
      cell: ({ row }) => {
        const quantity = row.getValue("quantity") as number
        const item = row.original
        return (
          <div className="flex items-center gap-2">
            <span className={quantity <= item.reorderLevel ? "text-destructive font-bold" : "text-foreground font-medium"}>{quantity}</span>
            {quantity <= item.reorderLevel && <AlertCircle className="h-3 w-3 text-destructive" />}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={status === "In Stock" ? "default" : status === "Low Stock" ? "destructive" : "outline"}
            className="font-medium"
          >
            {status}
          </Badge>
        )
      },
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventory Items</h1>
            <p className="text-muted-foreground">Manage your product catalog and stock levels</p>
          </div>
          <Button onClick={handleCreate} className="shadow-lg hover:shadow-xl transition-all">
            <Plus className="h-4 w-4 mr-2" />
            New Item
          </Button>
        </div>

        {isLoading ? (
          <div className="loading-center">
            <div className="loading-spinner text-primary"></div>
          </div>
        ) : (
          <Card className="p-0 border-none shadow-sm bg-transparent">
            <DataTable
              columns={columns}
              data={items}
              searchKey="name"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onPrint={(item) => toast({ title: "Printing Label", description: `Printing label for ${item.name}` })}
            />
          </Card>
        )}
      </div>

      {/* Form Dialog */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogMode === "create" ? "New Inventory Item" : `Edit: ${currentItem?.name}`}
        onSave={handleSave}
        isSaving={isLoading}
        maxWidth="3xl"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Portland Cement"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Materials">Materials</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                    <SelectItem value="Safety Gear">Safety Gear</SelectItem>
                    <SelectItem value="Machinery">Machinery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit of Measure</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(val) => setFormData({ ...formData, unit: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="liters">Liters (L)</SelectItem>
                    <SelectItem value="meters">Meters (m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="min-h-[100px]"
                placeholder="Detailed item description..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-4 bg-muted/20 border-dashed">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Inventory Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Unit Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice || 0}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Current Stock</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity || 0}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    disabled={dialogMode === "create"}
                  />
                  {dialogMode === "create" && <p className="text-[10px] text-muted-foreground">Initial stock is set via Goods Receiving</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reorder">Reorder Level</Label>
                  <Input
                    id="reorder"
                    type="number"
                    value={formData.reorderLevel || 10}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Warehouse Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. A-12-B"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </Card>

            <div className="flex items-center space-x-2 pt-4">
              <Checkbox id="active" defaultChecked />
              <Label htmlFor="active">Item is active and purchasable</Label>
            </div>
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
      />
    </ErpLayout>
  )
}
