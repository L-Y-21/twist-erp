import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Leave Management | TWIST ERP",
    description: "Manage employee leave requests",
}

export default function LeavesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
