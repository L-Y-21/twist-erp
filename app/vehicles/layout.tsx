import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Fleet Management | TWIST ERP",
    description: "Manage vehicles and equipment fleet",
}

export default function VehiclesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
