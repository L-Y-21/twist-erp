"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { VoucherTemplate } from "@/components/voucher-template"
import { navigationConfig } from "@/lib/navigation"

export default function WorkOrderDetailPage() {
  const workItems = [
    { description: "Engine oil replacement - Full synthetic", quantity: 6, unit: "Liters", unitPrice: 15.0, total: 90 },
    { description: "Oil filter replacement", quantity: 1, unit: "Unit", unitPrice: 25.0, total: 25 },
    { description: "Air filter cleaning and replacement", quantity: 1, unit: "Unit", unitPrice: 35.0, total: 35 },
    { description: "Labor - Technician hours", quantity: 3, unit: "Hours", unitPrice: 100.0, total: 300 },
  ]

  const subtotal = workItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/work-orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Work Order Details</h1>
            <p className="text-muted-foreground">WO-2025-0056</p>
          </div>
        </div>

        <VoucherTemplate
          documentType="WORK ORDER"
          documentNumber="WO-2025-0056"
          documentDate="2025-12-18"
          status="In Progress"
          items={workItems}
          subtotal={subtotal}
          tax={0}
          total={subtotal}
          notes="Vehicle: CAT-001 - Caterpillar 320D | Issue: Scheduled maintenance service | Priority: Medium | Assigned to: Mike Tech | Expected completion: 2025-12-19"
          preparedBy="Maintenance Manager"
          watermark="IN PROGRESS"
        />
      </div>
    </ErpLayout>
  )
}
