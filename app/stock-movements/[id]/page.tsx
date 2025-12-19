"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { VoucherTemplate } from "@/components/voucher-template"
import { navigationConfig } from "@/lib/navigation"

export default function StockMovementDetailPage() {
  const stockItems = [
    { description: "Portland Cement Grade 52.5", quantity: 100, unit: "50kg Bags", unitPrice: 45.0, total: 4500 },
    { description: "Steel Rebar 12mm", quantity: 300, unit: "Pieces", unitPrice: 15.0, total: 4500 },
    { description: "Safety Helmets", quantity: 25, unit: "Pieces", unitPrice: 12.0, total: 300 },
  ]

  const subtotal = stockItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/stock-movements">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Stock Movement Details</h1>
            <p className="text-muted-foreground">SM-OUT-2025-0089</p>
          </div>
        </div>

        <VoucherTemplate
          documentType="STOCK OUT VOUCHER"
          documentNumber="SM-OUT-2025-0089"
          documentDate="2025-12-17"
          status="Approved"
          items={stockItems}
          subtotal={subtotal}
          tax={0}
          total={subtotal}
          notes="Materials issued to Downtown Tower Construction site. Project: PRJ-001. Received by site supervisor Mike Tech."
          preparedBy="Warehouse Manager"
          approvedBy="Sarah Manager"
        />
      </div>
    </ErpLayout>
  )
}
