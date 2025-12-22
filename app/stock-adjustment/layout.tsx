import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Stock Adjustment | TWIST ERP",
    description: "Adjust inventory stock levels",
}

export default function StockAdjustmentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
