"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, Package, TrendingUp, TrendingDown, FileText, Clock } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { mockInventory } from "@/lib/mock-data"

export default function ItemDetailPage() {
  const router = useRouter()
  const params = useParams()

  const item = mockInventory.find((i) => i.id === params.id)

  if (!item) {
    return (
      <ErpLayout navigation={[]}>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Item Not Found</h2>
          <p className="text-muted-foreground">The item you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/items")}>Back to Items</Button>
        </div>
      </ErpLayout>
    )
  }

  // Mock data for tabs
  const stockMovements = [
    { id: "SM-001", date: "2025-01-15", type: "In", quantity: 100, reference: "PO-2025-001", notes: "Purchase Order" },
    { id: "SM-002", date: "2025-01-18", type: "Out", quantity: 25, reference: "PRJ-001", notes: "Project allocation" },
    { id: "SM-003", date: "2025-01-22", type: "Out", quantity: 30, reference: "PRJ-002", notes: "Project allocation" },
    { id: "SM-004", date: "2025-02-05", type: "In", quantity: 60, reference: "PO-2025-015", notes: "Restock" },
  ]

  const attachments = [
    { id: 1, name: "Product Specification.pdf", size: "2.4 MB", uploadedBy: "John Admin", uploadedAt: "2025-01-10" },
    { id: 2, name: "Safety Data Sheet.pdf", size: "1.8 MB", uploadedBy: "Sarah Manager", uploadedAt: "2025-01-12" },
  ]

  const auditLogs = [
    { id: 1, action: "Created", user: "John Admin", timestamp: "2025-01-10 09:30 AM", details: "Item created" },
    {
      id: 2,
      action: "Updated",
      user: "Sarah Manager",
      timestamp: "2025-01-15 02:15 PM",
      details: "Updated reorder level",
    },
    { id: 3, action: "Stock In", user: "Mike Tech", timestamp: "2025-01-18 11:00 AM", details: "Added 100 units" },
  ]

  return (
    <ErpLayout navigation={[]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{item.name}</h1>
              <p className="text-muted-foreground">{item.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/items/${item.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="movements">Stock Movement</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Item Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Item Code:</span>
                    <span className="font-medium">{item.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Item Name:</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unit:</span>
                    <span className="font-medium">{item.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant={
                        item.status === "In Stock" ? "default" : item.status === "Low Stock" ? "destructive" : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Pricing & Stock</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost Price:</span>
                    <span className="font-medium">${(item.unitPrice * 0.8).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selling Price:</span>
                    <span className="font-medium">${item.unitPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Stock:</span>
                    <span className="font-medium">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reorder Level:</span>
                    <span className="font-medium">
                      {item.reorderLevel} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Value:</span>
                    <span className="font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Additional Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Created By:</span>
                  <p className="font-medium">John Admin</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Created Date:</span>
                  <p className="font-medium">2025-01-10</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Last Modified By:</span>
                  <p className="font-medium">Sarah Manager</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Last Modified Date:</span>
                  <p className="font-medium">2025-02-15</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="movements">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Stock Movement History</h3>
              <div className="space-y-2">
                {stockMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {movement.type === "In" ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {movement.type} - {movement.quantity} {item.unit}
                        </p>
                        <p className="text-sm text-muted-foreground">{movement.notes}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{movement.reference}</p>
                      <p className="text-xs text-muted-foreground">{movement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="attachments">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Attachments</h3>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {attachment.size} • Uploaded by {attachment.uploadedBy}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{attachment.uploadedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Audit Trail</h3>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{log.user}</p>
                      <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErpLayout>
  )
}
