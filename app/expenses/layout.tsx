import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Expenses | TWIST ERP",
    description: "Track and manage business expenses",
}

export default function ExpensesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
