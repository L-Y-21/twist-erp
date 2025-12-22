import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Invoices | TWIST ERP",
    description: "Create and manage invoices",
}

export default function InvoicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
