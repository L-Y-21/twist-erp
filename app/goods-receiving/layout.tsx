import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Goods Receiving | TWIST ERP",
    description: "Receive and process incoming goods",
}

export default function GoodsReceivingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
