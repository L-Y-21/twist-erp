import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Attendance | TWIST ERP",
    description: "Track employee attendance and time",
}

export default function AttendanceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
