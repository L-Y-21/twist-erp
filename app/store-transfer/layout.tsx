import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Store Transfer | TWIST ERP",
    description: "Transfer items between stores",
}

export default function StoreTransferLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
