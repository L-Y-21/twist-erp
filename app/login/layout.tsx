import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Login | TWIST ERP",
    description: "Sign in to TWIST ERP Construction Management System",
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
