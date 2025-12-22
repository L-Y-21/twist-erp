"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, ChevronDown, ChevronRight, Globe, Search, Settings, User, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
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
import { getCurrentUser, logout, type User as AuthUser } from "@/lib/auth"
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
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Fix hydration mismatch by setting user on mount
  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [])

  // Initialize expanded items based on current path
  useEffect(() => {
    const parents = findParents(navigation, pathname)
    setExpandedItems((prev) => {
      const newItems = parents.map((p) => p.title)
      // Merge with existing expanded items, avoiding duplicates
      return Array.from(new Set([...prev, ...newItems]))
    })
  }, [pathname, navigation])

  const toggleItem = (title: string, siblingTitles: string[]) => {
    setExpandedItems((prev) => {
      const isExpanded = prev.includes(title)
      if (isExpanded) {
        return prev.filter((t) => t !== title)
      }
      // Close all siblings
      const filtered = prev.filter((t) => !siblingTitles.includes(t))
      return [...filtered, title]
    })
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
    <div className="flex h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col z-50",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Header/Brand Section - No Logo */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border/50">
          {!sidebarCollapsed ? (
            <span className="text-sidebar-foreground font-bold text-lg tracking-tight">TWIST ERP</span>
          ) : (
            <span className="text-sidebar-foreground font-bold text-lg tracking-tight mx-auto">T</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {navigation.map((item) => (
            <NavItemComponent
              key={item.title}
              item={item}
              expanded={expandedItems.includes(item.title)}
              expandedItems={expandedItems}
              onToggle={toggleItem}
              siblings={navigation.map((i) => i.title)}
              collapsed={sidebarCollapsed}
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
              pathname={pathname}
            />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 mt-auto border-t border-sidebar-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sidebar-foreground/70 hover:text-white hover:bg-white/5 transition-all duration-200 rounded-md h-9"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu className={cn("h-4 w-4 transition-transform duration-300", !sidebarCollapsed && "rotate-180")} />
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="flex h-16 items-center border-b bg-background px-6 gap-4 no-print z-40">
          {/* Global Search Bar */}
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search..."
              className="pl-9 h-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-md transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-2 ring-background" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-md p-0 shadow-lg border-border">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                    <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px] font-bold">3 New</Badge>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {[
                    { title: "Approval Required", desc: "Purchase Order #PO-2025-0034", type: "urgent" },
                    { title: "Low Stock Alert", desc: "Cement - 5 bags remaining", type: "warning" },
                    { title: "Maintenance Due", desc: "Vehicle CAT-001 service needed", type: "info" }
                  ].map((n, i) => (
                    <div key={i} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b last:border-0">
                      <p className="font-medium text-sm text-foreground">{n.title}</p>
                      <p className="text-muted-foreground text-xs mt-1">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="pl-2 pr-3 h-9 rounded-md hover:bg-muted transition-all gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {currentUser?.name?.charAt(0) || <User className="h-3 w-3" />}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{currentUser?.name}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-md shadow-lg border-border">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
          <div className="max-w-[1600px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function NavItemComponent({
  item,
  expanded,
  onToggle,
  siblings,
  collapsed,
  expandedItems,
  depth = 0,
  activeTooltip,
  setActiveTooltip,
  pathname,
}: {
  item: NavItem
  expanded: boolean
  onToggle: (title: string, siblingTitles: string[]) => void
  siblings: string[]
  collapsed: boolean
  expandedItems: string[]
  depth?: number
  activeTooltip: string | null
  setActiveTooltip: (title: string | null) => void
  pathname: string
}) {
  const hasChildren = item.children && item.children.length > 0
  const childTitles = item.children?.map((c) => c.title) || []
  const showTooltip = activeTooltip === item.title
  const router = useRouter()

  // Check if this item or any of its children are active
  const isActive = item.href === pathname || (hasChildren && item.children?.some(c => c.href === pathname))
  const isExactActive = item.href === pathname

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
        onToggle(item.title, siblings)
      }
    }
  }

  const content = (
    <>
      <span className={cn(
        "h-4 w-4 flex-shrink-0 transition-colors",
        isActive ? "text-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-white"
      )}>
        {item.icon}
      </span>
      {!collapsed && (
        <>
          <span className="flex-1 text-left font-medium text-sm truncate">{item.title}</span>
          {hasChildren && (
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200 text-sidebar-foreground/50",
                expanded && "rotate-90"
              )}
            />
          )}
        </>
      )}
    </>
  )

  const renderTooltip = () => {
    if (!collapsed || !showTooltip) return null

    return (
      <div
        className="fixed left-[70px] px-4 py-3 bg-popover text-popover-foreground text-sm rounded-md shadow-xl border border-border z-[100] whitespace-nowrap min-w-[200px] animate-in fade-in slide-in-from-left-2 duration-200"
        onMouseEnter={() => setActiveTooltip(item.title)}
        onMouseLeave={() => setActiveTooltip(null)}
      >
        <div className="font-semibold mb-2 text-primary border-b border-border pb-2">{item.title}</div>
        {hasChildren && item.children && (
          <div className="space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.title}
                href={child.href || "#"}
                className={cn(
                  "block px-2 py-1.5 rounded-sm hover:bg-muted transition-colors text-muted-foreground hover:text-foreground text-sm",
                  child.href === pathname && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => setActiveTooltip(null)}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Base styles for the item container
  const baseStyles = cn(
    "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 relative group select-none",
    collapsed && "justify-center px-0 py-3",
    // Active State (Parent or Child)
    isActive && !hasChildren && "bg-primary text-primary-foreground shadow-sm font-medium",
    isActive && hasChildren && !collapsed && "text-sidebar-foreground font-medium",
    // Hover State
    !isActive && "hover:bg-white/5 hover:text-white text-sidebar-foreground/80",
    // Depth 1 indentation (e.g., Master Data, Operations)
    depth === 1 && !collapsed && "ml-6 pl-3 text-sm before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-sidebar-border/40 before:rounded-full",
    // Depth 2+ indentation (e.g., Items, Categories under Master Data)
    depth >= 2 && !collapsed && "ml-12 pl-3 text-xs before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-sidebar-border/60 before:rounded-full"
  )

  return (
    <div className="relative">
      {item.href && !hasChildren ? (
        <Link
          href={item.href}
          className={baseStyles}
          onMouseEnter={() => collapsed && setActiveTooltip(item.title)}
          onMouseLeave={() => collapsed && setActiveTooltip(null)}
        >
          {content}
        </Link>
      ) : (
        <button
          onClick={handleClick}
          className={baseStyles}
          onMouseEnter={() => collapsed && setActiveTooltip(item.title)}
          onMouseLeave={() => collapsed && !hasChildren && setActiveTooltip(null)}
        >
          {content}
        </button>
      )}

      {renderTooltip()}

      {/* Child Items (Tree View) */}
      {!collapsed && hasChildren && expanded && (
        <div className="mt-0.5 space-y-0.5">
          {item.children?.map((child) => (
            <NavItemComponent
              key={child.title}
              item={child}
              expanded={expandedItems.includes(child.title)}
              expandedItems={expandedItems}
              onToggle={onToggle}
              siblings={childTitles}
              collapsed={collapsed}
              depth={depth + 1}
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
              pathname={pathname}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Helper to find parent items of the current path
function findParents(items: NavItem[], pathname: string): NavItem[] {
  for (const item of items) {
    if (item.href === pathname) {
      return [item]
    }
    if (item.children) {
      const parents = findParents(item.children, pathname)
      if (parents.length > 0) {
        return [item, ...parents]
      }
    }
  }
  return []
}
