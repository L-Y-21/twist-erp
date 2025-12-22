import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Store Issue | TWIST ERP",
    description: "Issue items from store inventory",
}

export default function StoreIssueLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
