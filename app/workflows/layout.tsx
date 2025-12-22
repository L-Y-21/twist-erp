import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Workflows | TWIST ERP",
    description: "Manage approval workflows and processes",
}

export default function WorkflowsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
