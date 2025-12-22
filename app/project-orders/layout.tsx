import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Project Orders | TWIST ERP",
    description: "Manage project-specific orders",
}

export default function ProjectOrdersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
