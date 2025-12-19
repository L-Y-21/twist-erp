"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Printer, Download, Mail } from "lucide-react"

interface VoucherItem {
  description: string
  quantity: number
  unit: string
  unitPrice: number
  tax?: number
  total: number
}

interface VoucherTemplateProps {
  documentType: string
  documentNumber: string
  documentDate: string
  status: "Draft" | "Submitted" | "Approved" | "Rejected" | "Posted"
  items: VoucherItem[]
  subtotal: number
  tax: number
  discount?: number
  total: number
  notes?: string
  preparedBy?: string
  approvedBy?: string
  watermark?: string
}

export function VoucherTemplate({
  documentType,
  documentNumber,
  documentDate,
  status,
  items,
  subtotal,
  tax,
  discount = 0,
  total,
  notes,
  preparedBy = "System User",
  approvedBy,
  watermark,
}: VoucherTemplateProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 no-print">
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
      </div>

      <Card className="p-8 relative overflow-hidden print-area">
        {watermark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-[120px] font-bold text-muted/10 rotate-[-45deg]">{watermark}</div>
          </div>
        )}

        <div className="space-y-6 relative">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  T
                </div>
                <div>
                  <h1 className="text-2xl font-bold">TWIST ERP</h1>
                  <p className="text-sm text-muted-foreground">Construction Management System</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>123 Construction Avenue</p>
                <p>Business District, City 12345</p>
                <p>Phone: +1 234 567 8900</p>
                <p>Email: info@twisterp.com</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">{documentType}</h2>
              <div className="mt-2 space-y-1">
                <div className="text-sm">
                  <span className="text-muted-foreground">Document #:</span>
                  <span className="font-medium ml-2">{documentNumber}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="ml-2">{documentDate}</span>
                </div>
                <Badge
                  variant={
                    status === "Approved"
                      ? "default"
                      : status === "Draft"
                        ? "secondary"
                        : status === "Rejected"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items Table */}
          <div>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-semibold">Description</th>
                  <th className="text-right py-2 text-sm font-semibold">Quantity</th>
                  <th className="text-right py-2 text-sm font-semibold">Unit Price</th>
                  {items.some((i) => i.tax) && <th className="text-right py-2 text-sm font-semibold">Tax</th>}
                  <th className="text-right py-2 text-sm font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 text-sm">
                      {item.description}
                      <span className="text-muted-foreground ml-1">({item.unit})</span>
                    </td>
                    <td className="text-right text-sm">{item.quantity}</td>
                    <td className="text-right text-sm">${item.unitPrice.toFixed(2)}</td>
                    {items.some((i) => i.tax) && <td className="text-right text-sm">${(item.tax || 0).toFixed(2)}</td>}
                    <td className="text-right text-sm font-medium">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax:</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="font-medium text-destructive">-${discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {notes && (
            <div className="space-y-2">
              <Separator />
              <div>
                <p className="text-sm font-semibold">Notes:</p>
                <p className="text-sm text-muted-foreground">{notes}</p>
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="space-y-2">
              <div className="border-t border-muted pt-2">
                <p className="text-sm font-medium">Prepared By</p>
                <p className="text-sm text-muted-foreground">{preparedBy}</p>
              </div>
            </div>
            {approvedBy && (
              <div className="space-y-2">
                <div className="border-t border-muted pt-2">
                  <p className="text-sm font-medium">Approved By</p>
                  <p className="text-sm text-muted-foreground">{approvedBy}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <Separator />
          <div className="text-center text-xs text-muted-foreground">
            <p>This is a computer-generated document. No signature is required.</p>
            <p className="mt-1">TWIST ERP - Page 1 of 1 - Printed on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
