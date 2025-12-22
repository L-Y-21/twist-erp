import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Payments | TWIST ERP",
    description: "Manage payments and transactions",
}

export default function PaymentsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
