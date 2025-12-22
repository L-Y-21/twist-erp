import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Preventive Maintenance | TWIST ERP",
    description: "Schedule preventive maintenance tasks",
}

export default function PreventiveLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
