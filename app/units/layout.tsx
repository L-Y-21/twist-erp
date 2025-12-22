import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Business Units | TWIST ERP",
    description: "Manage organizational units and departments",
}

export default function UnitsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
