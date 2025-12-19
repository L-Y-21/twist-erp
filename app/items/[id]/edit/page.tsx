"use client"

import type React from "react"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { navigationConfig } from "@/lib/navigation"
import { mockInventory } from "@/lib/mock-data"

export default function EditItemPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Find the item to edit
  const item = mockInventory.find((i) => i.id === params.id)

  // Form state with pre-filled data
  const [formData, setFormData] = useState({
    itemCode: item?.id || "",
    itemName: item?.name || "",
    category: item?.category || "",
    unit: item?.unit || "",
    costPrice: item ? String(item.unitPrice * 0.8) : "",
    sellingPrice: item ? String(item.unitPrice) : "",
    openingStock: item ? String(item.quantity) : "",
    reorderLevel: item ? String(item.reorderLevel) : "",
    status: item?.status === "In Stock" ? "Active" : item?.status === "Out of Stock" ? "Inactive" : "Active",
  })

  const categories = [
    "Building Materials",
    "Steel",
    "Safety Equipment",
    "Paints & Coatings",
    "Tools & Equipment",
    "Electrical",
    "Plumbing",
    "Wood",
    "Hardware",
    "Insulation",
    "Flooring",
  ]

  const units = ["Pieces", "kg", "Liters", "Meters", "Boxes", "Bags", "Rolls", "Sheets", "Pairs"]

  useEffect(() => {
    if (!item) {
      toast({
        title: "Item Not Found",
        description: "The item you're looking for doesn't exist.",
        variant: "destructive",
      })
      router.push("/items")
    }
  }, [item, router, toast])

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item name is required"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
    }
    if (!formData.unit) {
      newErrors.unit = "Unit is required"
    }
    if (!formData.costPrice || Number.parseFloat(formData.costPrice) <= 0) {
      newErrors.costPrice = "Cost price must be greater than 0"
    }
    if (!formData.sellingPrice || Number.parseFloat(formData.sellingPrice) <= 0) {
      newErrors.sellingPrice = "Selling price must be greater than 0"
    }
    if (
      formData.costPrice &&
      formData.sellingPrice &&
      Number.parseFloat(formData.sellingPrice) < Number.parseFloat(formData.costPrice)
    ) {
      newErrors.sellingPrice = "Selling price should be greater than or equal to cost price"
    }
    if (!formData.openingStock || Number.parseFloat(formData.openingStock) < 0) {
      newErrors.openingStock = "Opening stock must be 0 or greater"
    }
    if (!formData.reorderLevel || Number.parseFloat(formData.reorderLevel) < 0) {
      newErrors.reorderLevel = "Reorder level must be 0 or greater"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Item Updated",
        description: "The item has been successfully updated.",
      })
      router.push("/items")
    }, 1000)
  }

  if (!item) {
    return null
  }

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Item</h1>
            <p className="text-muted-foreground">Update item information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="itemCode">Item Code</Label>
                <Input id="itemCode" value={formData.itemCode} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemName">
                  Item Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange("itemName", e.target.value)}
                  placeholder="Enter item name"
                  className={errors.itemName ? "border-destructive" : ""}
                />
                {errors.itemName && <p className="text-xs text-destructive">{errors.itemName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">
                  Unit <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                  <SelectTrigger className={errors.unit ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && <p className="text-xs text-destructive">{errors.unit}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPrice">
                  Cost Price <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => handleInputChange("costPrice", e.target.value)}
                  placeholder="0.00"
                  className={errors.costPrice ? "border-destructive" : ""}
                />
                {errors.costPrice && <p className="text-xs text-destructive">{errors.costPrice}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPrice">
                  Selling Price <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
                  placeholder="0.00"
                  className={errors.sellingPrice ? "border-destructive" : ""}
                />
                {errors.sellingPrice && <p className="text-xs text-destructive">{errors.sellingPrice}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="openingStock">
                  Current Stock <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="openingStock"
                  type="number"
                  value={formData.openingStock}
                  onChange={(e) => handleInputChange("openingStock", e.target.value)}
                  placeholder="0"
                  className={errors.openingStock ? "border-destructive" : ""}
                />
                {errors.openingStock && <p className="text-xs text-destructive">{errors.openingStock}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reorderLevel">
                  Reorder Level <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => handleInputChange("reorderLevel", e.target.value)}
                  placeholder="0"
                  className={errors.reorderLevel ? "border-destructive" : ""}
                />
                {errors.reorderLevel && <p className="text-xs text-destructive">{errors.reorderLevel}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Updating..." : "Update Item"}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </ErpLayout>
  )
}
