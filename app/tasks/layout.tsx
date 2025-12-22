import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Tasks | TWIST ERP",
    description: "Track tasks and assignments",
}

export default function TasksLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
