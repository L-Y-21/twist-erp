"use client"

import { ErpLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { VoucherTemplate } from "@/components/voucher-template"
import { navigationConfig } from "@/lib/navigation"

export default function FuelLogDetailPage() {
  const fuelItems = [
    {
      description: "Diesel Fuel - CAT-001 Excavator Refill",
      quantity: 250,
      unit: "Liters",
      unitPrice: 1.5,
      total: 375,
    },
  ]

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/fuel-logs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Fuel Log Details</h1>
            <p className="text-muted-foreground">FL-2025-0012</p>
          </div>
        </div>

        <VoucherTemplate
          documentType="FUEL LOG VOUCHER"
          documentNumber="FL-2025-0012"
          documentDate="2025-12-18"
          status="Approved"
          items={fuelItems}
          subtotal={375}
          tax={0}
          total={375}
          notes="Vehicle: CAT-001 - Caterpillar 320D | Driver: Mike Tech | Odometer: 45,230 km | Location: Downtown Tower Construction Site"
          preparedBy="Mike Tech"
          approvedBy="Sarah Manager"
        />
      </div>
    </ErpLayout>
  )
}
