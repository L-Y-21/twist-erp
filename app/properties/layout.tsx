import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Properties | TWIST ERP",
    description: "Manage property listings and details",
}

export default function PropertiesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
