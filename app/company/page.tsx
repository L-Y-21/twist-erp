"use client"

import { useState, useEffect } from "react"
import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Upload, Plus, Trash2, Edit } from "lucide-react"
import { navigationConfig } from "@/lib/navigation"
import { CrudModal } from "@/components/crud-modal"
import { DeleteDialog } from "@/components/delete-dialog"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { toast } from "sonner"
import { generateId, simulateDelay } from "@/lib/utils"

interface Branch {
  id: string
  name: string
  code: string
  address: string
  phone: string
  email: string
  manager: string
}

const mockBranches: Branch[] = [
  {
    id: "1",
    name: "Main Office",
    code: "MO",
    address: "123 Construction Avenue",
    phone: "+1 234 567 8900",
    email: "main@twisterp.com",
    manager: "John Admin",
  },
  {
    id: "2",
    name: "Site A",
    code: "SA",
    address: "456 Project Road",
    phone: "+1 234 567 8901",
    email: "sitea@twisterp.com",
    manager: "Sarah Manager",
  },
]

export default function CompanyProfilePage() {
  const [branches, setBranches] = useState<Branch[]>(mockBranches)
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false)
  const [isEditBranchOpen, setIsEditBranchOpen] = useState(false)
  const [isDeleteBranchOpen, setIsDeleteBranchOpen] = useState(false)
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [branchFormData, setBranchFormData] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
    email: "",
    manager: "",
  })

  const [themeColor, setThemeColor] = useState("#166534")

  useEffect(() => {
    const savedColor = localStorage.getItem("theme-color")
    if (savedColor) {
      setThemeColor(savedColor)
    }
  }, [])

  const handleAddBranch = () => {
    setBranchFormData({ name: "", code: "", address: "", phone: "", email: "", manager: "" })
    setIsAddBranchOpen(true)
  }

  const handleEditBranch = (branch: Branch) => {
    setCurrentBranch(branch)
    setBranchFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      manager: branch.manager,
    })
    setIsEditBranchOpen(true)
  }

  const handleDeleteBranch = (branch: Branch) => {
    setCurrentBranch(branch)
    setIsDeleteBranchOpen(true)
  }

  const handleSubmitAddBranch = async () => {
    if (!branchFormData.name || !branchFormData.code) {
      toast.error("Please fill in required fields")
      return
    }

    setIsLoading(true)
    await simulateDelay(1000)

    const newBranch: Branch = {
      id: generateId(),
      ...branchFormData,
    }

    setBranches([...branches, newBranch])
    setIsAddBranchOpen(false)
    setIsLoading(false)
    toast.success("Branch added successfully")
  }

  const handleSubmitEditBranch = async () => {
    if (!currentBranch) return

    setIsLoading(true)
    await simulateDelay(1000)

    setBranches(branches.map((b) => (b.id === currentBranch.id ? { ...b, ...branchFormData } : b)))
    setIsEditBranchOpen(false)
    setIsLoading(false)
    setCurrentBranch(null)
    toast.success("Branch updated successfully")
  }

  const handleConfirmDeleteBranch = async () => {
    if (!currentBranch) return

    setIsLoading(true)
    await simulateDelay(1000)

    setBranches(branches.filter((b) => b.id !== currentBranch.id))
    setIsDeleteBranchOpen(false)
    setIsLoading(false)
    setCurrentBranch(null)
    toast.success("Branch deleted successfully")
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    await simulateDelay(1000)

    localStorage.setItem("theme-color", themeColor)

    const hsl = hexToHSL(themeColor)
    document.documentElement.style.setProperty("--primary", `oklch(${hsl.l}% ${hsl.s}% ${hsl.h})`)

    setIsLoading(false)
    toast.success("Settings saved successfully! Theme color applied to all buttons.")
  }

  const hexToHSL = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return { h: 0, s: 0, l: 0 }

    const r = Number.parseInt(result[1], 16) / 255
    const g = Number.parseInt(result[2], 16) / 255
    const b = Number.parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Company Profile</h1>
            <p className="text-muted-foreground">Manage company information and branding</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="branding">Branding & Theme</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input defaultValue="TWIST Construction Group" />
                  </div>

                  <div className="space-y-2">
                    <Label>Trade License Number</Label>
                    <Input defaultValue="TCG-2020-12345" />
                  </div>

                  <div className="space-y-2">
                    <Label>Tax Registration Number</Label>
                    <Input defaultValue="TAX-987654321" />
                  </div>

                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Input defaultValue="Construction & Engineering" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Company Description</Label>
                    <Textarea
                      defaultValue="Leading construction company specializing in commercial and residential projects. Over 20 years of experience in the construction industry."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input defaultValue="+1 234 567 8900" />
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" defaultValue="info@twisterp.com" />
                  </div>

                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input defaultValue="www.twisterp.com" />
                  </div>

                  <div className="space-y-2">
                    <Label>Fax Number</Label>
                    <Input defaultValue="+1 234 567 8901" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Street Address</Label>
                    <Input defaultValue="123 Construction Avenue" />
                  </div>

                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input defaultValue="Business District" />
                  </div>

                  <div className="space-y-2">
                    <Label>State/Province</Label>
                    <Input defaultValue="Metropolitan" />
                  </div>

                  <div className="space-y-2">
                    <Label>Postal Code</Label>
                    <Input defaultValue="12345" />
                  </div>

                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input defaultValue="United States" />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="branches" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleAddBranch}>
                <Plus className="mr-2 h-4 w-4" />
                Add Branch
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {branches.map((branch) => (
                <Card key={branch.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{branch.name}</h3>
                      <p className="text-sm text-muted-foreground">Code: {branch.code}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditBranch(branch)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteBranch(branch)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Address: </span>
                      {branch.address}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone: </span>
                      {branch.phone}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email: </span>
                      {branch.email}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Manager: </span>
                      {branch.manager}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Company Logo</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload your company logo for documents and reports
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-24 w-24 rounded border-2 border-dashed border-border flex items-center justify-center bg-muted">
                        <div className="h-16 w-16 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl">
                          T
                        </div>
                      </div>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Document Watermark Text</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Default watermark for draft and unapproved documents
                    </p>
                    <Input defaultValue="TWIST ERP" className="max-w-sm" />
                  </div>

                  <div>
                    <Label>Primary Theme Color</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Customize the primary color of your ERP system (applies to all buttons and accents)
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-10 w-10 rounded border cursor-pointer"
                          style={{ backgroundColor: themeColor }}
                          onClick={() => document.getElementById("colorPicker")?.click()}
                        />
                        <Input
                          id="colorPicker"
                          type="color"
                          value={themeColor}
                          onChange={(e) => setThemeColor(e.target.value)}
                          className="w-0 h-0 opacity-0 absolute"
                        />
                        <Input
                          value={themeColor}
                          onChange={(e) => setThemeColor(e.target.value)}
                          className="max-w-[150px]"
                        />
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setThemeColor("#166534")}>
                          Dark Green
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setThemeColor("#3B5998")}>
                          Blue
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setThemeColor("#7C3AED")}>
                          Purple
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setThemeColor("#DC2626")}>
                          Red
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setThemeColor("#EA580C")}>
                          Orange
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 p-4 rounded-lg border" style={{ backgroundColor: themeColor + "20" }}>
                      <p className="text-sm" style={{ color: themeColor }}>
                        This is a preview of your selected theme color
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button style={{ backgroundColor: themeColor }} className="text-white">
                          Primary Button
                        </Button>
                        <Button variant="outline" style={{ borderColor: themeColor, color: themeColor }}>
                          Outline Button
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleSaveSettings} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Branch Modals */}
      <CrudModal
        open={isAddBranchOpen}
        onOpenChange={setIsAddBranchOpen}
        title="Add New Branch"
        description="Create a new branch or location"
        onSubmit={handleSubmitAddBranch}
        isLoading={isLoading}
        submitLabel="Add Branch"
      >
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormFieldWrapper label="Branch Name" required>
              <Input
                value={branchFormData.name}
                onChange={(e) => setBranchFormData({ ...branchFormData, name: e.target.value })}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Branch Code" required>
              <Input
                value={branchFormData.code}
                onChange={(e) => setBranchFormData({ ...branchFormData, code: e.target.value })}
              />
            </FormFieldWrapper>
          </div>
          <FormFieldWrapper label="Address">
            <Input
              value={branchFormData.address}
              onChange={(e) => setBranchFormData({ ...branchFormData, address: e.target.value })}
            />
          </FormFieldWrapper>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormFieldWrapper label="Phone">
              <Input
                value={branchFormData.phone}
                onChange={(e) => setBranchFormData({ ...branchFormData, phone: e.target.value })}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Email">
              <Input
                type="email"
                value={branchFormData.email}
                onChange={(e) => setBranchFormData({ ...branchFormData, email: e.target.value })}
              />
            </FormFieldWrapper>
          </div>
          <FormFieldWrapper label="Branch Manager">
            <Input
              value={branchFormData.manager}
              onChange={(e) => setBranchFormData({ ...branchFormData, manager: e.target.value })}
            />
          </FormFieldWrapper>
        </div>
      </CrudModal>

      <CrudModal
        open={isEditBranchOpen}
        onOpenChange={setIsEditBranchOpen}
        title="Edit Branch"
        description="Update branch information"
        onSubmit={handleSubmitEditBranch}
        isLoading={isLoading}
        submitLabel="Save Changes"
      >
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormFieldWrapper label="Branch Name" required>
              <Input
                value={branchFormData.name}
                onChange={(e) => setBranchFormData({ ...branchFormData, name: e.target.value })}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Branch Code" required>
              <Input
                value={branchFormData.code}
                onChange={(e) => setBranchFormData({ ...branchFormData, code: e.target.value })}
              />
            </FormFieldWrapper>
          </div>
          <FormFieldWrapper label="Address">
            <Input
              value={branchFormData.address}
              onChange={(e) => setBranchFormData({ ...branchFormData, address: e.target.value })}
            />
          </FormFieldWrapper>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormFieldWrapper label="Phone">
              <Input
                value={branchFormData.phone}
                onChange={(e) => setBranchFormData({ ...branchFormData, phone: e.target.value })}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Email">
              <Input
                type="email"
                value={branchFormData.email}
                onChange={(e) => setBranchFormData({ ...branchFormData, email: e.target.value })}
              />
            </FormFieldWrapper>
          </div>
          <FormFieldWrapper label="Branch Manager">
            <Input
              value={branchFormData.manager}
              onChange={(e) => setBranchFormData({ ...branchFormData, manager: e.target.value })}
            />
          </FormFieldWrapper>
        </div>
      </CrudModal>

      <DeleteDialog
        open={isDeleteBranchOpen}
        onOpenChange={setIsDeleteBranchOpen}
        onConfirm={handleConfirmDeleteBranch}
        title="Delete Branch"
        description={`Are you sure you want to delete ${currentBranch?.name}? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </ErpLayout>
  )
}
