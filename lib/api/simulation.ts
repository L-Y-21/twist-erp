export interface UserPermissions {
  modules: string[] // ['inventory', 'projects', 'hr']
  actions: string[] // ['create', 'read', 'update', 'delete']
  licensedUntil: string
  role: "admin" | "manager" | "staff"
}

const MOCK_PERMISSIONS: UserPermissions = {
  modules: ["inventory", "projects", "dashboard", "settings"],
  actions: ["create", "read", "update", "delete"],
  licensedUntil: "Dec 31, 2026",
  role: "admin",
}

// Simulated Database in memory
const DB = {
  items: [
    { id: "1", name: "Cement Bag 50kg", code: "CMT-001", stock: 1250, unit: "Bags", status: "In Stock" },
    { id: "2", name: "Steel Rod 12mm", code: "STL-012", stock: 45, unit: "Rods", status: "Low Stock" },
    { id: "3", name: "Safety Helmets", code: "PPE-004", stock: 80, unit: "Units", status: "In Stock" },
  ],
  projects: [
    { id: "1", name: "Al Reem Island Tower", code: "PRJ-001", progress: 65, budget: 5000000, status: "Active" },
    { id: "2", name: "Downtown Infrastructure", code: "PRJ-002", progress: 30, budget: 1200000, status: "Active" },
    { id: "3", name: "Airport Expansion", code: "PRJ-003", progress: 0, budget: 8500000, status: "Planning" },
  ],
}

export const simulateApi = {
  getPermissions: async (): Promise<UserPermissions> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PERMISSIONS), 200))
  },
  inventory: {
    getAll: async () => DB.items,
    create: async (data: any) => {
      const newItem = { ...data, id: Math.random().toString(36).substr(2, 9) }
      DB.items.push(newItem)
      return newItem
    },
    update: async (id: string, data: any) => {
      const idx = DB.items.findIndex((i) => i.id === id)
      if (idx !== -1) DB.items[idx] = { ...DB.items[idx], ...data }
      return DB.items[idx]
    },
    delete: async (id: string) => {
      DB.items = DB.items.filter((i) => i.id !== id)
      return { success: true }
    },
  },
  projects: {
    getAll: async () => DB.projects,
    create: async (data: any) => {
      const newProj = { ...data, id: Math.random().toString(36).substr(2, 9) }
      DB.projects.push(newProj)
      return newProj
    },
    update: async (id: string, data: any) => {
      const idx = DB.projects.findIndex((p) => p.id === id)
      if (idx !== -1) DB.projects[idx] = { ...DB.projects[idx], ...data }
      return DB.projects[idx]
    },
    delete: async (id: string) => {
      DB.projects = DB.projects.filter((p) => p.id !== id)
      return { success: true }
    },
  },
}
