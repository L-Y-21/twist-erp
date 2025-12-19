"use client"

import type React from "react"

import { checkAccess } from "@/lib/auth"
import { Lock } from "lucide-react"
import { Card } from "@/components/ui/card"

interface PermissionGuardProps {
  module: string
  action?: "view" | "create" | "edit" | "delete"
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({ module, action = "view", children, fallback }: PermissionGuardProps) {
  const hasAccess = checkAccess(module, action)

  if (!hasAccess) {
    return (
      fallback || (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground">You don't have permission to {action} this module.</p>
              <p className="text-sm text-muted-foreground mt-2">Please contact your administrator for access.</p>
            </div>
          </div>
        </Card>
      )
    )
  }

  return <>{children}</>
}

export function ActionButton({
  module,
  action,
  children,
  ...props
}: {
  module: string
  action: "create" | "edit" | "delete"
  children: React.ReactNode
} & React.ComponentProps<"button">) {
  const hasAccess = checkAccess(module, action)

  if (!hasAccess) {
    return null
  }

  return <button {...props}>{children}</button>
}
