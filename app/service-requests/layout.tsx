import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Service Requests | TWIST ERP",
    description: "Track service requests and maintenance",
}

export default function ServiceRequestsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
