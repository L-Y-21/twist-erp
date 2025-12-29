import { v4 as uuidv4 } from "uuid"

export interface UserPermissions {
  modules: string[] // ['inventory', 'projects', 'hr']
  actions: string[] // ['create', 'read', 'update', 'delete']
  licensedUntil: string
}

const MOCK_PERMISSIONS: UserPermissions = {
  modules: ["inventory", "projects", "dashboard"],
  actions: ["create", "read", "update", "delete"],
  licensedUntil: "2026-12-31",
}

// Simulated Database in memory
const DB = {
  items: [
    {
      id: "1",
      name: "Cement Bag 50kg",
      code: "CMT-001",
      categoryId: "1",
      unitId: "1",
      reorderLevel: 50,
      isActive: true,
    },
    {
      id: "2",
      name: "Steel Rod 12mm",
      code: "STL-012",
      categoryId: "2",
      unitId: "2",
      reorderLevel: 20,
      isActive: true,
    },
  ],
  projects: [
    { id: "1", name: "Al Reem Island Tower", code: "PRJ-2024-001", status: "Active", budget: 5000000 },
    { id: "2", name: "Downtown Infrastructure", code: "PRJ-2024-002", status: "Planning", budget: 1200000 },
  ],
}

export const simulateApi = {
  getPermissions: async (): Promise<UserPermissions> => {
    console.log("[v0] Fetching simulated permissions...")
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_PERMISSIONS), 300)
    })
  },

  inventory: {
    getAll: async () => {
      return new Promise((resolve) => setTimeout(() => resolve([...DB.items]), 500))
    },
    create: async (data: any) => {
      const newItem = { ...data, id: uuidv4() }
      DB.items.push(newItem)
      return newItem
    },
    update: async (id: string, data: any) => {
      const index = DB.items.findIndex((i) => i.id === id)
      if (index > -1) {
        DB.items[index] = { ...DB.items[index], ...data }
        return DB.items[index]
      }
      throw new Error("Item not found")
    },
    delete: async (id: string) => {
      DB.items = DB.items.filter((i) => i.id !== id)
      return { success: true }
    },
  },

  projects: {
    getAll: async () => {
      return new Promise((resolve) => setTimeout(() => resolve([...DB.projects]), 500))
    },
    create: async (data: any) => {
      const newProject = { ...data, id: uuidv4() }
      DB.projects.push(newProject)
      return newProject
    },
    update: async (id: string, data: any) => {
      const index = DB.projects.findIndex((p) => p.id === id)
      if (index > -1) {
        DB.projects[index] = { ...DB.projects[index], ...data }
        return DB.projects[index]
      }
      throw new Error("Project not found")
    },
    delete: async (id: string) => {
      DB.projects = DB.projects.filter((p) => p.id !== id)
      return { success: true }
    },
  },
}
