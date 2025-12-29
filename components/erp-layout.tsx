"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Bell, ChevronDown, SettingsIcon, Menu, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { simulateApi, type UserPermissions } from "@/lib/api/simulation"
import { LayoutDashboard, Package, FolderKanban, FileText } from "lucide-react"

interface NavItem {
  title: string
  icon: React.ReactNode
  href?: string
  module?: string
}

export function ErpLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    simulateApi.getPermissions().then((p) => {
      setPermissions(p)
      setIsLoading(false)
    })
  }, [])

  const navGroups = [
    {
      label: "Core Modules",
      items: [
        { title: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/", module: "dashboard" },
        { title: "Inventory", icon: <Package className="h-5 w-5" />, href: "/items", module: "inventory" },
        { title: "Projects", icon: <FolderKanban className="h-5 w-5" />, href: "/projects", module: "projects" },
      ],
    },
    {
      label: "System",
      items: [
        { title: "Reports", icon: <FileText className="h-5 w-5" />, href: "/reports", module: "reports" },
        { title: "Settings", icon: <SettingsIcon className="h-5 w-5" />, href: "/settings", module: "settings" },
      ],
    },
  ]

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading System...</div>

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside
        className={cn(
          "sidebar-gradient border-r border-sidebar-border transition-all duration-300 flex flex-col z-20 sticky top-0 h-screen",
          sidebarCollapsed ? "w-20" : "w-64",
        )}
      >
        <div className="p-6 flex items-center justify-between">
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

        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">{group.label}</p>
              )}
              {group.items
                .filter((i) => permissions?.modules.includes(i.module))
                .map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all group"
                  >
                    {item.icon}
                    {!sidebarCollapsed && <span className="font-medium">{item.title}</span>}
                  </Link>
                ))}
            </div>
          ))}
        </nav>

        {!sidebarCollapsed && permissions && (
          <div className="p-4 mx-4 mb-6 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/60">
            <p className="uppercase font-bold mb-1 tracking-widest text-white/40">Enterprise License</p>
            <p className="flex justify-between">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold uppercase">Active</span>
            </p>
            <p className="flex justify-between">
              <span>Expires:</span>
              <span>{permissions.licensedUntil}</span>
            </p>
          </div>
        )}
      </aside>

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-md px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900">Dashboard</h2>
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 border border-slate-200">
              <span className="text-slate-400 font-normal">Branch:</span>
              <span>Headquarters</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <Clock className="h-4 w-4" />
              {new Date().toLocaleDateString()}
            </div>
            <Button variant="ghost" size="icon" className="rounded-full bg-slate-100">
              <Bell className="h-5 w-5 text-slate-600" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              JD
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  )
}
