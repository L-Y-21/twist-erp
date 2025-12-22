import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Work Orders | TWIST ERP",
    description: "Create and track work orders",
}

export default function WorkOrdersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
