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
import { Plus, Edit, Trash2, Tag, Package, Activity, Layers } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormFieldWrapper } from "@/components/form-field-wrapper"

interface Category {
  id: string
  name: string
  code: string
  description: string
  itemCount: number
  status: "Active" | "Inactive"
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Construction Materials",
    code: "CM-001",
    description: "Raw materials for construction projects",
    itemCount: 156,
    status: "Active",
  },
  {
    id: "2",
    name: "Electrical Supplies",
    code: "ES-002",
    description: "Wiring, fixtures, and electrical components",
    itemCount: 89,
    status: "Active",
  },
  {
    id: "3",
    name: "Plumbing Fixtures",
    code: "PF-003",
    description: "Pipes, valves, and bathroom fixtures",
    itemCount: 45,
    status: "Active",
  },
  {
    id: "4",
    name: "Safety Equipment",
    code: "SE-004",
    description: "PPE, helmets, and safety gear",
    itemCount: 32,
    status: "Active",
  },
  {
    id: "5",
    name: "Tools & Machinery",
    code: "TM-005",
    description: "Hand tools and heavy machinery",
    itemCount: 67,
    status: "Inactive",
  },
]

export default function CategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  const handleSave = (data: any) => {
    toast({
      title: editingCategory ? "Category Updated" : "Category Created",
      description: `The category has been successfully ${editingCategory ? "updated" : "created"}.`,
    })
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
    toast({
      title: "Category Deleted",
      description: "The category has been removed from the system.",
      variant: "destructive",
    })
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "code",
      header: ({ column }: { column: any }) => <SortableHeader column={column}>Code</SortableHeader>,
      cell: ({ row }: { row: any }) => <span className="font-mono text-xs font-bold text-primary">{row.getValue("code")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }: { column: any }) => <SortableHeader column={column}>Name</SortableHeader>,
      cell: ({ row }: { row: any }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: { row: any }) => <span className="text-sidebar-foreground/60 truncate max-w-[200px] block">{row.getValue("description")}</span>,
    },
    {
      accessorKey: "itemCount",
      header: "Items",
      cell: ({ row }: { row: any }) => <Badge variant="secondary">{row.getValue("itemCount")} items</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "Active" ? "default" : "outline"}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setCategoryToDelete(row.original.id)
              setDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Inventory <span className="text-primary">Categories</span></h1>
            <p className="text-muted-foreground mt-1">Organize and classify your inventory items</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewSwitcher view={viewMode} onViewChange={setViewMode} />
            <Button
              onClick={() => {
                setEditingCategory(null)
                setIsModalOpen(true)
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] rounded-xl px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Categories", value: categories.length, icon: <Layers className="h-5 w-5" />, color: "text-blue-400" },
            { label: "Active Categories", value: categories.filter((c) => c.status === "Active").length, icon: <Activity className="h-5 w-5" />, color: "text-emerald-400" },
            { label: "Total Items", value: categories.reduce((sum, c) => sum + c.itemCount, 0).toLocaleString(), icon: <Package className="h-5 w-5" />, color: "text-amber-400" },
            { label: "Avg Items/Cat", value: (categories.reduce((sum, c) => sum + c.itemCount, 0) / categories.length).toFixed(0), icon: <Tag className="h-5 w-5" />, color: "text-emerald-500" },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 bg-glass border-glass relative overflow-hidden group hover:border-primary/30 transition-all duration-500 rounded-3xl">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                {stat.icon}
              </div>
              <div className="relative z-10">
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-sidebar-foreground/40 mb-2">{stat.label}</div>
                <div className={cn("text-3xl font-black tracking-tight", stat.color)}>{stat.value}</div>
              </div>
            </Card>
          ))}
        </div>

        {viewMode === "table" ? (
          <Card className="p-6 bg-glass border-glass rounded-3xl overflow-hidden">
            <DataTable columns={columns} data={categories} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <GridCard
                key={category.id}
                title={category.name}
                subtitle={category.code}
                badges={[{ label: category.status, variant: category.status === "Active" ? "default" : "secondary" }]}
                metadata={[
                  { icon: Package, label: `${category.itemCount} items` },
                  { icon: Tag, label: category.description },
                ]}
                onEdit={() => handleEdit(category)}
                onDelete={() => {
                  setCategoryToDelete(category.id)
                  setDeleteDialogOpen(true)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <CrudModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setEditingCategory(null)
        }}
        onSubmit={() => handleSave({})}
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <div className="grid grid-cols-1 gap-4">
          <FormFieldWrapper label="Category Code" required>
            <Input defaultValue={editingCategory?.code} placeholder="e.g. CM-001" />
          </FormFieldWrapper>
          <FormFieldWrapper label="Category Name" required>
            <Input defaultValue={editingCategory?.name} placeholder="e.g. Construction Materials" />
          </FormFieldWrapper>
          <FormFieldWrapper label="Description">
            <Input defaultValue={editingCategory?.description} placeholder="Brief description of the category" />
          </FormFieldWrapper>
          <FormFieldWrapper label="Status" required>
            <Select defaultValue={editingCategory?.status || "Active"}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        </div>
      </CrudModal>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (categoryToDelete) handleDelete(categoryToDelete)
          setDeleteDialogOpen(false)
        }}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone and may affect items assigned to it."
      />
    </ErpLayout>
  )
}
