import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Roles & Permissions | TWIST ERP",
    description: "Configure user roles and permissions",
}

export default function RolesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
