import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Numbering Schemes | TWIST ERP",
    description: "Configure document numbering patterns",
}

export default function NumberingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
