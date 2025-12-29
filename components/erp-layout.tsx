"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Bell, ChevronDown, ChevronRight, Globe, Settings, User, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import { simulateApi, type UserPermissions } from "@/lib/api/simulation"

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    simulateApi.getPermissions().then(setPermissions)
  }, [])

  const filteredNavigation = navigation.filter((item) => {
    if (!permissions) return false
    const moduleKey = item.title.toLowerCase().split(" ")[0]
    return permissions.modules.includes(moduleKey) || item.title === "Dashboard" || item.title === "System Settings"
  })

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "sidebar-gradient border-r border-sidebar-border transition-all duration-300 flex flex-col z-20",
          sidebarCollapsed ? "w-20" : "w-64",
          "relative",
        )}
      >
        <div className="p-6 flex items-center justify-between no-print">
          {!sidebarCollapsed && <span className="text-xl font-bold text-white tracking-tight">DevExtreme</span>}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-2 overflow-y-visible">
          {filteredNavigation.map((item) => (
            <NavItemComponent key={item.title} item={item} collapsed={sidebarCollapsed} />
          ))}
        </nav>

        {!sidebarCollapsed && permissions && (
          <div className="p-4 mx-3 mb-6 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/50">
            <p className="uppercase font-bold mb-1 tracking-widest">Enterprise License</p>
            <p>Valid until: {permissions.licensedUntil}</p>
          </div>
        )}
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-20 items-center border-b bg-card/80 backdrop-blur-md px-8 gap-4 no-print sticky top-0 z-30">
          <div className="flex-1">
            <h2 className="text-sm font-medium text-muted-foreground">Dashboard</h2>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
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

            <Button variant="ghost" size="icon" asChild>
              <Link href="/company">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{getCurrentUser()?.name}</p>
                    <p className="text-xs text-muted-foreground">{getCurrentUser()?.role}</p>
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
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-8 pb-20">{children}</main>
      </div>
    </div>
  )
}

function NavItemComponent({
  item,
  collapsed,
  depth = 0,
}: {
  item: NavItem
  collapsed: boolean
  depth?: number
}) {
  const hasChildren = item.children && item.children.length > 0
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    if (collapsed) {
      if (hasChildren) {
        e.preventDefault()
        e.stopPropagation()
      } else if (item.href) {
        router.push(item.href)
      }
    }
  }

  const content = (
    <>
      <span className="h-4 w-4 flex-shrink-0">{item.icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{item.title}</span>
          {hasChildren && <ChevronRight className={cn("h-4 w-4 transition-transform", depth > 0 && "rotate-90")} />}
        </>
      )}
    </>
  )

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
          )}
        >
          {content}
        </button>
      )}

      {!collapsed && hasChildren && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavItemComponent key={child.title} item={child} collapsed={collapsed} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
