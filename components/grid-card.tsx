"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Edit, Trash } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { checkAccess } from "@/lib/auth"

interface GridCardProps {
  data?: Record<string, any>
  module?: string

  // Custom render pattern (for projects, vehicles, etc.)
  renderContent?: (data: Record<string, any>) => React.ReactNode

  // Template pattern (for users, etc.)
  title?: string
  subtitle?: string
  badges?: Array<{ label: string; variant?: "default" | "secondary" | "destructive" | "outline" }>
  metadata?: Array<{ icon: LucideIcon; label: string }>

  // Common props
  onView?: (id?: string) => void
  onEdit?: (id?: string) => void
  onDelete?: (id?: string) => void

  // Override permissions (for template pattern)
  canEdit?: boolean
  canDelete?: boolean
}

export function GridCard({
  data,
  module,
  renderContent,
  title,
  subtitle,
  badges,
  metadata,
  onView,
  onEdit,
  onDelete,
  canEdit: canEditOverride,
  canDelete: canDeleteOverride,
}: GridCardProps) {
  const canEdit = module ? checkAccess(module, "edit") : (canEditOverride ?? true)
  const canDelete = module ? checkAccess(module, "delete") : (canDeleteOverride ?? true)

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {renderContent && data ? (
            // Custom render pattern
            renderContent(data)
          ) : (
            // Template pattern
            <div className="space-y-3">
              {(title || subtitle) && (
                <div>
                  {title && <h3 className="font-semibold text-lg">{title}</h3>}
                  {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </div>
              )}

              {badges && badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <Badge key={index} variant={badge.variant || "default"}>
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              )}

              {metadata && metadata.length > 0 && (
                <div className="space-y-2">
                  {metadata.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {(canEdit || canDelete || onView) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(data?.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
              )}
              {canEdit && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(data?.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && onDelete && (
                <DropdownMenuItem onClick={() => onDelete(data?.id)} className="text-destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Card>
  )
}

export default GridCard
