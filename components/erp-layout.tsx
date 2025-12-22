"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, ChevronDown, ChevronRight, Globe, Search, Settings, User, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getCurrentUser, logout } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface NavItem {
  title: string
  icon: React.ReactNode
  href?: string
  children?: NavItem[]
}

interface ErpLayoutProps {
  children: React.ReactNode
  navigation: NavItem[]
}

export function ErpLayout({ children, navigation }: ErpLayoutProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboard"])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const savedColor = localStorage.getItem("theme-color")
    if (savedColor) {
      applyThemeColor(savedColor)
    }
  }, [])

  const applyThemeColor = (color: string) => {
    const hsl = hexToHSL(color)
    document.documentElement.style.setProperty("--primary", `oklch(${hsl.l}% ${hsl.s}% ${hsl.h})`)
  }

  const hexToHSL = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return { h: 0, s: 0, l: 0 }

    const r = Number.parseInt(result[1], 16) / 255
    const g = Number.parseInt(result[2], 16) / 255
    const b = Number.parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const toggleItem = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col sticky top-0 h-screen",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigation.map((item) => (
            <NavItemComponent
              key={item.title}
              item={item}
              expanded={expandedItems.includes(item.title)}
              onToggle={toggleItem}
              collapsed={sidebarCollapsed}
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
            />
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <span className="flex items-center gap-2">
                <Menu className="h-4 w-4" /> Collapse
              </span>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center border-b bg-card px-6 gap-4 no-print sticky top-0 z-10">
          {/* Global Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search... (Ctrl + K)" className="pl-9 bg-muted/50" />
          </div>

          {/* Spacer to push items to the right */}
          <div className="flex-1" />

          {/* Right Side Actions - moved to end */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>العربية</DropdownMenuItem>
                <DropdownMenuItem>Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-2 p-2">
                  <div className="text-sm p-2 rounded bg-muted/50">
                    <p className="font-medium">Approval Required</p>
                    <p className="text-muted-foreground text-xs">Purchase Order #PO-2025-0034</p>
                  </div>
                  <div className="text-sm p-2 rounded bg-muted/50">
                    <p className="font-medium">Low Stock Alert</p>
                    <p className="text-muted-foreground text-xs">Cement - 5 bags remaining</p>
                  </div>
                  <div className="text-sm p-2 rounded bg-muted/50">
                    <p className="font-medium">Maintenance Due</p>
                    <p className="text-muted-foreground text-xs">Vehicle CAT-001 service needed</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/company">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/company">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

function NavItemComponent({
  item,
  expanded,
  onToggle,
  collapsed,
  depth = 0,
  activeTooltip,
  setActiveTooltip,
}: {
  item: NavItem
  expanded: boolean
  onToggle: (title: string) => void
  collapsed: boolean
  depth?: number
  activeTooltip: string | null
  setActiveTooltip: (title: string | null) => void
}) {
  const hasChildren = item.children && item.children.length > 0
  const showTooltip = activeTooltip === item.title
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    if (collapsed) {
      if (hasChildren) {
        setActiveTooltip(showTooltip ? null : item.title)
        e.preventDefault()
        e.stopPropagation()
      } else if (item.href) {
        router.push(item.href)
      }
    } else {
      if (hasChildren) {
        onToggle(item.title)
      }
    }
  }

  const content = (
    <>
      <span className="h-4 w-4 flex-shrink-0">{item.icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{item.title}</span>
          {hasChildren && <ChevronRight className={cn("h-4 w-4 transition-transform", expanded && "rotate-90")} />}
        </>
      )}
    </>
  )

  const renderTooltip = () => {
    if (!collapsed || !showTooltip) return null

    return (
      <div
        className="fixed left-[72px] px-4 py-3 bg-popover text-popover-foreground text-sm rounded-lg shadow-xl border border-border z-[100] whitespace-nowrap min-w-[200px] max-w-[280px]"
        onMouseEnter={() => setActiveTooltip(item.title)}
        onMouseLeave={() => setActiveTooltip(null)}
      >
        <div className="font-semibold mb-2 text-base">{item.title}</div>
        {hasChildren && item.children && (
          <div className="space-y-2 text-sm">
            {item.children.map((child) => (
              <div key={child.title}>
                {child.href ? (
                  <Link
                    href={child.href}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent/20 transition-colors text-muted-foreground hover:text-foreground"
                    onClick={() => setActiveTooltip(null)}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {child.title}
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                    {child.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {!hasChildren && item.href && <div className="text-xs text-muted-foreground mt-1">Click to open</div>}
      </div>
    )
  }

  return (
    <div className="relative">
      {item.href && !hasChildren ? (
        <Link
          href={item.href}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors relative",
            depth > 0 && "pl-8",
            collapsed && "justify-center",
          )}
          onMouseEnter={() => collapsed && setActiveTooltip(item.title)}
          onMouseLeave={() => collapsed && setActiveTooltip(null)}
        >
          {content}
        </Link>
      ) : (
        <button
          onClick={handleClick}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors relative",
            depth > 0 && "pl-8",
            collapsed && "justify-center",
            showTooltip && collapsed && "bg-sidebar-accent",
          )}
          onMouseEnter={() => collapsed && setActiveTooltip(item.title)}
          onMouseLeave={() => collapsed && !hasChildren && setActiveTooltip(null)}
        >
          {content}
        </button>
      )}

      {renderTooltip()}

      {!collapsed && hasChildren && expanded && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavItemComponent
              key={child.title}
              item={child}
              expanded={expanded}
              onToggle={onToggle}
              collapsed={collapsed}
              depth={depth + 1}
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
            />
          ))}
        </div>
      )}
    </div>
  )
}
