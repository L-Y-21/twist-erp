"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"

interface ViewSwitcherProps {
  view: "grid" | "table"
  onViewChange: (view: "grid" | "table") => void
}

export function ViewSwitcher({ view, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="inline-flex rounded-lg border bg-background p-1">
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="h-8"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        className="h-8"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}
