import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Fuel Logs | TWIST ERP",
    description: "Track vehicle fuel consumption",
}

export default function FuelLogsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
