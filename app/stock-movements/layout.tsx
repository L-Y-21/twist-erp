import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Stock Movements | TWIST ERP",
    description: "Track inventory movements and history",
}

export default function StockMovementsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
