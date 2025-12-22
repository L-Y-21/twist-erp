import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Leases | TWIST ERP",
    description: "Track property leases and agreements",
}

export default function LeasesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
