import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Stores | TWIST ERP",
    description: "Manage warehouse and store locations",
}

export default function StoresLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
