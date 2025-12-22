import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Trip Orders | TWIST ERP",
    description: "Manage vehicle trip orders",
}

export default function TripOrdersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
