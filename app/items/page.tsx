"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ActionMenu } from "@/components/action-menu"
import { ViewSwitcher } from "@/components/view-switcher"
import { GridCard } from "@/components/grid-card"
import { Plus, AlertCircle, FileText, Package } from "lucide-react"
import { DataTable, SortableHeader } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { type InventoryItem, mockInventory } from "@/lib/mock-data"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { formatCurrency } from "@/lib/utils"
import { DeleteDialog } from "@/components/delete-dialog"

export default function ItemsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [items, setItems] = useState<InventoryItem[]>(mockInventory)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [activeTab, setActiveTab] = useState("all")

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
        <ActionMenu
          onView={() => router.push(`/items/${row.original.id}`)}
          onEdit={() => router.push(`/items/${row.original.id}/edit`)}
          onDelete={() => handleDelete(row.original.id)}
          onDuplicate={() => {
            toast({ title: "Item Duplicated", description: "Item has been duplicated successfully." })
          }}
        />
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
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">Manage stock, transactions, and warehouses</p>
          </div>
          <div className="flex gap-2">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button onClick={() => router.push("/items/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="receiving">Goods Receiving</TabsTrigger>
            <TabsTrigger value="issue">Store Issue</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="adjustment">Adjustment</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">Total Items</div>
                <div className="text-2xl font-bold">{filteredItems.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">Total Value</div>
                <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
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

            {viewMode === "list" ? (
              <Card className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-muted-foreground">Loading...</div>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-2">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <GridCard
                    key={item.id}
                    icon={<Package className="h-5 w-5" />}
                    title={item.name}
                    subtitle={item.id}
                    status={item.status}
                    fields={[
                      { label: "Category", value: item.category },
                      { label: "Stock", value: `${item.quantity} ${item.unit}` },
                      { label: "Price", value: formatCurrency(item.unitPrice) },
                      { label: "Value", value: formatCurrency(item.quantity * item.unitPrice) },
                    ]}
                    onView={() => router.push(`/items/${item.id}`)}
                    onEdit={() => router.push(`/items/${item.id}/edit`)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stores">
            <Card className="p-6">
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Stores & Warehouses</h3>
                <p className="text-muted-foreground mb-4">Manage your store locations and inventory</p>
                <Button onClick={() => router.push("/stores")}>Go to Stores</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="p-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Stock Movements</h3>
                <p className="text-muted-foreground mb-4">View all inventory transactions</p>
                <Button onClick={() => router.push("/stock-movements")}>View Transactions</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="receiving">
            <Card className="p-6">
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Goods Receiving</h3>
                <p className="text-muted-foreground mb-4">Receive items into inventory</p>
                <Button onClick={() => router.push("/goods-receiving")}>Go to Goods Receiving</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="issue">
            <Card className="p-6">
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Store Issue</h3>
                <p className="text-muted-foreground mb-4">Issue items from store</p>
                <Button onClick={() => router.push("/store-issue")}>Go to Store Issue</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="transfer">
            <Card className="p-6">
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Store Transfer</h3>
                <p className="text-muted-foreground mb-4">Transfer items between stores</p>
                <Button onClick={() => router.push("/store-transfer")}>Go to Store Transfer</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="adjustment">
            <Card className="p-6">
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Stock Adjustment</h3>
                <p className="text-muted-foreground mb-4">Adjust inventory quantities</p>
                <Button onClick={() => router.push("/stock-adjustment")}>Go to Stock Adjustment</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
      />
    </ErpLayout>
  )
}
