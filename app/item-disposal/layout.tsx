import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Item Disposal | TWIST ERP",
    description: "Manage disposal of inventory items",
}

export default function ItemDisposalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
