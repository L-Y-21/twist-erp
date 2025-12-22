import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Requisitions | TWIST ERP",
    description: "Manage purchase requisitions",
}

export default function RequisitionsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
