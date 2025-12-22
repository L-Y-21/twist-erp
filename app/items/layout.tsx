import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Inventory Items | TWIST ERP",
    description: "Manage your product catalog and stock levels",
}

export default function ItemsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
