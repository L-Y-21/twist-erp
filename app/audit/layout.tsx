import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Audit Trail | TWIST ERP",
    description: "View system audit logs and history",
}

export default function AuditLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
