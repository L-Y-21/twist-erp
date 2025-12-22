import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Company Settings | TWIST ERP",
    description: "Configure company information and settings",
}

export default function CompanyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
