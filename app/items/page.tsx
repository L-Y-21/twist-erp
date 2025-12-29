"use client"

import type React from "react"
import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/data-table"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
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
import { cn } from "@/lib/utils"

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
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    stock: 0,
    unit: "Units",
    status: "In Stock",
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
      toast({ title: "Success", description: "Item updated" })
    } else {
      await simulateApi.inventory.create(formData)
      toast({ title: "Success", description: "Item created" })
    }
    setIsDialogOpen(false)
    loadData()
  }

  const handleDelete = async (id: string) => {
    await simulateApi.inventory.delete(id)
    toast({ title: "Success", description: "Item deleted" })
    loadData()
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      code: item.code,
      stock: item.stock,
      unit: item.unit,
      status: item.status,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      name: "",
      code: "",
      stock: 0,
      unit: "Units",
      status: "In Stock",
    })
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <span className="font-mono text-xs font-bold text-slate-500">{row.getValue("code")}</span>,
    },
    {
      accessorKey: "name",
      header: "Item Name",
      cell: ({ row }) => <span className="font-semibold text-slate-900">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-bold">{row.getValue("stock")}</span>
          <span className="text-xs text-slate-400">{row.original.unit}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant="outline"
            className={cn(
              "font-bold uppercase tracking-wider text-[10px]",
              status === "In Stock"
                ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                : "text-amber-600 bg-amber-50 border-amber-100",
            )}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-400 hover:text-indigo-600"
            onClick={() => handleEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-400 hover:text-rose-600"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
              <Package className="h-4 w-4" /> Inventory Management
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Stock Control</h1>
            <p className="text-slate-500 font-medium">Manage and monitor construction materials in real-time.</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
            className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="mr-2 h-5 w-5" /> Add New Item
          </Button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Active Inventory", value: items.length.toString(), sub: "Items in system", color: "indigo" },
            {
              label: "Low Stock Alert",
              value: items.filter((i) => i.stock < 50).length.toString(),
              sub: "Items below threshold",
              color: "amber",
            },
            { label: "Monthly Movement", value: "+24%", sub: "Stock turnover rate", color: "emerald" },
          ].map((stat, i) => (
            <Card key={i} className="p-8 bg-white border-slate-100 shadow-sm relative overflow-hidden group">
              <div
                className={cn(
                  "absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-5 transition-transform group-hover:scale-110",
                  `bg-${stat.color}-600`,
                )}
              />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-900 mb-1">{stat.value}</h3>
              <p className={cn("text-xs font-bold", `text-${stat.color}-600`)}>{stat.sub}</p>
            </Card>
          ))}
        </div>

        <Card className="border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <div className="relative w-72">
              <Input
                placeholder="Search inventory..."
                className="pl-10 h-10 bg-white border-slate-200 rounded-lg text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Plus className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 rotate-45" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-10 px-4 font-bold border-slate-200 bg-transparent">
                Export
              </Button>
              <Button variant="outline" size="sm" className="h-10 px-4 font-bold border-slate-200 bg-transparent">
                Filter
              </Button>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={items.filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()))}
          />
        </Card>
      </div>

      {/* Dialog remains similar but with styled inputs matching the new aesthetic */}
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
