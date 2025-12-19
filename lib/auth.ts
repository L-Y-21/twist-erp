"use client"

export interface User {
  id: string
  username: string
  name: string
  role: string
  email: string
  permissions: string[]
  licensedModules: string[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const USERS = [
  {
    id: "1",
    username: "admin",
    password: "123456",
    name: "John Admin",
    role: "Administrator",
    email: "admin@twisterp.com",
    permissions: [
      // Dashboard
      "dashboard.view",
      "dashboard.create",
      "dashboard.edit",
      "dashboard.delete",

      // User Management
      "users.view",
      "users.create",
      "users.edit",
      "users.delete",
      "roles.view",
      "roles.create",
      "roles.edit",
      "roles.delete",

      // Projects
      "projects.view",
      "projects.create",
      "projects.edit",
      "projects.delete",
      "project-orders.view",
      "project-orders.create",
      "project-orders.edit",
      "project-orders.delete",
      "tasks.view",
      "tasks.create",
      "tasks.edit",
      "tasks.delete",

      // Fleet
      "fleet.view",
      "fleet.create",
      "fleet.edit",
      "fleet.delete",
      "vehicles.view",
      "vehicles.create",
      "vehicles.edit",
      "vehicles.delete",
      "drivers.view",
      "drivers.create",
      "drivers.edit",
      "drivers.delete",
      "fuel-logs.view",
      "fuel-logs.create",
      "fuel-logs.edit",
      "fuel-logs.delete",
      "trip-orders.view",
      "trip-orders.create",
      "trip-orders.edit",
      "trip-orders.delete",

      // Inventory
      "inventory.view",
      "inventory.create",
      "inventory.edit",
      "inventory.delete",
      "items.view",
      "items.create",
      "items.edit",
      "items.delete",
      "categories.view",
      "categories.create",
      "categories.edit",
      "categories.delete",
      "stores.view",
      "stores.create",
      "stores.edit",
      "stores.delete",
      "stock-movements.view",
      "stock-movements.create",
      "stock-movements.edit",
      "stock-movements.delete",
      "goods-receiving.view",
      "goods-receiving.create",
      "goods-receiving.edit",
      "goods-receiving.delete",
      "properties.view",
      "properties.create",
      "properties.edit",
      "properties.delete",
      "units.view",
      "units.create",
      "units.edit",
      "units.delete",

      // Service & Maintenance
      "service.view",
      "service.create",
      "service.edit",
      "service.delete",
      "work-orders.view",
      "work-orders.create",
      "work-orders.edit",
      "work-orders.delete",
      "leases.view",
      "leases.create",
      "leases.edit",
      "leases.delete",
      "service-requests.view",
      "service-requests.create",
      "service-requests.edit",
      "service-requests.delete",
      "preventive.view",
      "preventive.create",
      "preventive.edit",
      "preventive.delete",

      // HR
      "hr.view",
      "hr.create",
      "hr.edit",
      "hr.delete",
      "employees.view",
      "employees.create",
      "employees.edit",
      "employees.delete",
      "attendance.view",
      "attendance.create",
      "attendance.edit",
      "attendance.delete",
      "leaves.view",
      "leaves.create",
      "leaves.edit",
      "leaves.delete",
      "payroll.view",
      "payroll.create",
      "payroll.edit",
      "payroll.delete",

      // Finance
      "finance.view",
      "finance.create",
      "finance.edit",
      "finance.delete",
      "invoices.view",
      "invoices.create",
      "invoices.edit",
      "invoices.delete",
      "expenses.view",
      "expenses.create",
      "expenses.edit",
      "expenses.delete",
      "payments.view",
      "payments.create",
      "payments.edit",
      "payments.delete",

      // Settings
      "settings.view",
      "settings.edit",
      "company.view",
      "company.edit",
      "numbering.view",
      "numbering.edit",
      "workflows.view",
      "workflows.edit",
      "audit.view",
    ],
    licensedModules: [
      "dashboard",
      "projects",
      "project-orders",
      "tasks",
      "fleet",
      "vehicles",
      "drivers",
      "fuel-logs",
      "trip-orders",
      "inventory",
      "items",
      "categories",
      "stores",
      "stock-movements",
      "goods-receiving",
      "properties",
      "units",
      "service",
      "work-orders",
      "leases",
      "service-requests",
      "preventive",
      "hr",
      "employees",
      "attendance",
      "leaves",
      "payroll",
      "finance",
      "invoices",
      "expenses",
      "payments",
      "settings",
      "users",
      "roles",
      "company",
      "numbering",
      "workflows",
      "audit",
    ],
  },
]

export function login(username: string, password: string): User | null {
  const trimmedUsername = username.trim()
  const trimmedPassword = password.trim()

  const user = USERS.find((u) => u.username === trimmedUsername && u.password === trimmedPassword)

  if (user) {
    const { password: _, ...userWithoutPassword } = user
    localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword))
    return userWithoutPassword
  }

  return null
}

export function logout() {
  localStorage.removeItem("auth_user")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }

  const userData = localStorage.getItem("auth_user")
  return userData ? JSON.parse(userData) : null
}

export function hasPermission(permission: string): boolean {
  const user = getCurrentUser()
  return user?.permissions.includes(permission) ?? false
}

export function hasModuleLicense(module: string): boolean {
  const user = getCurrentUser()
  return user?.licensedModules.includes(module) ?? false
}

export function checkAccess(module: string, action: "view" | "create" | "edit" | "delete"): boolean {
  const user = getCurrentUser()
  const hasLicense = hasModuleLicense(module)
  const permission = `${module}.${action}`
  const hasPermission = user?.permissions.includes(permission) ?? false

  return hasLicense && hasPermission
}
