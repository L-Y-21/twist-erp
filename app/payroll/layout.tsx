import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Payroll | TWIST ERP",
    description: "Process employee payroll and salaries",
}

export default function PayrollLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
