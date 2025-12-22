import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Drivers | TWIST ERP",
    description: "Manage driver information and assignments",
}

export default function DriversLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
