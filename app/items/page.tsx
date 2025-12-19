"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Upload,
  Filter,
  Search,
  Trash2,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Eye,
  Edit,
  X,
  Package,
} from "lucide-react"
import { DataTable, SortableHeader } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { type InventoryItem, mockInventory } from "@/lib/mock-data"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"

export default function ItemsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [items, setItems] = useState<InventoryItem[]>(mockInventory)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const categories = Array.from(new Set(items.map((item) => item.category)))

  const filteredItems = items.filter((item) => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesStatus && matchesSearch
  })

  const handleDelete = (id: string) => {
    setItemToDelete(id)
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

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return
    setIsLoading(true)
    setTimeout(() => {
      setItems(items.filter((item) => !selectedItems.includes(item.id)))
      setSelectedItems([])
      setIsLoading(false)
      toast({
        title: "Items Deleted",
        description: `${selectedItems.length} item(s) have been deleted.`,
      })
    }, 500)
  }

  const handleExport = (format: "excel" | "pdf") => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Export Successful",
        description: `Items exported as ${format.toUpperCase()}.`,
      })
    }, 1000)
  }

  const handleImport = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Import Successful",
        description: "Items have been imported successfully.",
      })
    }, 1000)
  }

  const columns: ColumnDef<InventoryItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
            if (value) {
              setSelectedItems(filteredItems.map((item) => item.id))
            } else {
              setSelectedItems([])
            }
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedItems.includes(row.original.id)}
          onCheckedChange={(value) => {
            if (value) {
              setSelectedItems([...selectedItems, row.original.id])
            } else {
              setSelectedItems(selectedItems.filter((id) => id !== row.original.id))
            }
          }}
        />
      ),
    },
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column}>Item Code</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Item Name</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("unit")}</span>,
    },
    {
      accessorKey: "unitPrice",
      header: ({ column }) => <SortableHeader column={column}>Price</SortableHeader>,
      cell: ({ row }) => {
        const price = row.getValue("unitPrice") as number
        return <span>${price.toFixed(2)}</span>
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
            <span>{quantity}</span>
            {quantity <= item.reorderLevel && <AlertCircle className="h-4 w-4 text-destructive" />}
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
          <Badge variant={status === "In Stock" ? "default" : status === "Low Stock" ? "destructive" : "outline"}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => router.push(`/items/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => router.push(`/items/${row.original.id}/edit`)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const totalValue = filteredItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const lowStockCount = filteredItems.filter((item) => item.status === "Low Stock").length

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory Items</h1>
            <p className="text-muted-foreground">Manage stock and materials</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
            <Button variant="outline" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={() => handleExport("excel")}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport("pdf")}>
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button onClick={() => router.push("/items/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Items</div>
            <div className="text-2xl font-bold">{filteredItems.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Low Stock Items</div>
            <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Categories</div>
            <div className="text-2xl font-bold">{categories.length}</div>
          </Card>
        </div>

        {showFilters && (
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="In Stock">In Stock</SelectItem>
                    <SelectItem value="Low Stock">Low Stock</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="pt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCategoryFilter("all")
                    setStatusFilter("all")
                    setSearchQuery("")
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </Card>
        )}

        {selectedItems.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{selectedItems.length} item(s) selected</div>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={isLoading}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-2">
              <Package className="h-12 w-12 text-muted-foreground" />
              <div className="text-lg font-medium">No items found</div>
              <div className="text-sm text-muted-foreground">Try adjusting your filters or add a new item</div>
              <Button onClick={() => router.push("/items/new")} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : (
            <DataTable columns={columns} data={filteredItems} />
          )}
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item from the inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ErpLayout>
  )
}
