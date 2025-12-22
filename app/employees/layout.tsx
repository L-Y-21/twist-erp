import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Employees | TWIST ERP",
    description: "Employee management and records",
}

export default function EmployeesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
