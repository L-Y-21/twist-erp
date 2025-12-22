import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Categories | TWIST ERP",
    description: "Manage item categories and classifications",
}

export default function CategoriesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
