import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Purchase Returns | TWIST ERP",
    description: "Process purchase returns and refunds",
}

export default function PurchaseReturnLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
