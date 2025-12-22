import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "User Management | TWIST ERP",
    description: "Manage system users and access",
}

export default function UsersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
