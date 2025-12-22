// Mock data for the ERP system

export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Accountant" | "HR" | "Technician" | "Driver" | "Viewer"
  avatar?: string
}

export interface Project {
  id: string
  name: string
  status: "Planning" | "Active" | "On Hold" | "Completed"
  budget: number
  spent: number
  startDate: string
  endDate: string
  progress: number
}

export interface Vehicle {
  id: string
  name: string
  type: string
  plate: string
  status: "Available" | "In Use" | "Maintenance"
  driver?: string
  lastMaintenance: string
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  unitPrice: number
  reorderLevel: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
  location?: string
}

export const mockUsers: User[] = [
  { id: "1", name: "John Admin", email: "john@twist.com", role: "Admin" },
  { id: "2", name: "Sarah Manager", email: "sarah@twist.com", role: "Manager" },
  { id: "3", name: "Mike Tech", email: "mike@twist.com", role: "Technician" },
]

export const mockProjects: Project[] = [
  {
    id: "PRJ-001",
    name: "Downtown Tower Construction",
    status: "Active",
    budget: 2500000,
    spent: 1875000,
    startDate: "2025-01-15",
    endDate: "2025-12-31",
    progress: 75,
  },
  {
    id: "PRJ-002",
    name: "Highway Bridge Renovation",
    status: "Active",
    budget: 1800000,
    spent: 900000,
    startDate: "2025-03-01",
    endDate: "2025-11-30",
    progress: 50,
  },
  {
    id: "PRJ-003",
    name: "Shopping Mall Development",
    status: "Planning",
    budget: 4500000,
    spent: 0,
    startDate: "2025-06-01",
    endDate: "2026-12-31",
    progress: 0,
  },
]

export const mockVehicles: Vehicle[] = [
  {
    id: "VEH-001",
    name: "Caterpillar 320D",
    type: "Excavator",
    plate: "CAT-001",
    status: "In Use",
    driver: "Mike Tech",
    lastMaintenance: "2025-01-15",
  },
  {
    id: "VEH-002",
    name: "Volvo FMX Mixer",
    type: "Concrete Mixer",
    plate: "MIX-001",
    status: "Available",
    lastMaintenance: "2025-02-01",
  },
  {
    id: "VEH-003",
    name: "Toyota Hilux",
    type: "Pickup Truck",
    plate: "TRK-001",
    status: "Maintenance",
    lastMaintenance: "2024-12-20",
  },
]

export const mockInventory: InventoryItem[] = [
  {
    id: "ITM-001",
    name: "Portland Cement",
    category: "Building Materials",
    quantity: 5,
    unit: "50kg Bags",
    unitPrice: 45,
    reorderLevel: 50,
    status: "Low Stock",
  },
  {
    id: "ITM-002",
    name: "Steel Rebar 12mm",
    category: "Steel",
    quantity: 250,
    unit: "Pieces",
    unitPrice: 15,
    reorderLevel: 100,
    status: "In Stock",
  },
  {
    id: "ITM-003",
    name: "Safety Helmets",
    category: "Safety Equipment",
    quantity: 45,
    unit: "Pieces",
    unitPrice: 12,
    reorderLevel: 20,
    status: "In Stock",
  },
  {
    id: "ITM-004",
    name: "Concrete Blocks",
    category: "Building Materials",
    quantity: 1200,
    unit: "Pieces",
    unitPrice: 2.5,
    reorderLevel: 500,
    status: "In Stock",
  },
  {
    id: "ITM-005",
    name: "Paint - White",
    category: "Paints & Coatings",
    quantity: 80,
    unit: "Liters",
    unitPrice: 25,
    reorderLevel: 30,
    status: "In Stock",
  },
  {
    id: "ITM-006",
    name: "Welding Rods",
    category: "Tools & Equipment",
    quantity: 15,
    unit: "Boxes",
    unitPrice: 35,
    reorderLevel: 20,
    status: "Low Stock",
  },
  {
    id: "ITM-007",
    name: "Safety Gloves",
    category: "Safety Equipment",
    quantity: 150,
    unit: "Pairs",
    unitPrice: 5,
    reorderLevel: 50,
    status: "In Stock",
  },
  {
    id: "ITM-008",
    name: "Electrical Cable 2.5mm",
    category: "Electrical",
    quantity: 0,
    unit: "Meters",
    unitPrice: 1.2,
    reorderLevel: 500,
    status: "Out of Stock",
  },
  {
    id: "ITM-009",
    name: "PVC Pipes 4 inch",
    category: "Plumbing",
    quantity: 200,
    unit: "Pieces",
    unitPrice: 8,
    reorderLevel: 100,
    status: "In Stock",
  },
  {
    id: "ITM-010",
    name: "Plywood 18mm",
    category: "Wood",
    quantity: 45,
    unit: "Sheets",
    unitPrice: 42,
    reorderLevel: 20,
    status: "In Stock",
  },
  {
    id: "ITM-011",
    name: "Nails - Assorted",
    category: "Hardware",
    quantity: 25,
    unit: "Boxes",
    unitPrice: 18,
    reorderLevel: 15,
    status: "In Stock",
  },
  {
    id: "ITM-012",
    name: "Insulation Foam",
    category: "Insulation",
    quantity: 8,
    unit: "Rolls",
    unitPrice: 55,
    reorderLevel: 10,
    status: "Low Stock",
  },
  {
    id: "ITM-013",
    name: "Tiles - Ceramic",
    category: "Flooring",
    quantity: 500,
    unit: "Pieces",
    unitPrice: 4.5,
    reorderLevel: 200,
    status: "In Stock",
  },
  {
    id: "ITM-014",
    name: "Safety Vests",
    category: "Safety Equipment",
    quantity: 35,
    unit: "Pieces",
    unitPrice: 8,
    reorderLevel: 20,
    status: "In Stock",
  },
  {
    id: "ITM-015",
    name: "Gravel",
    category: "Building Materials",
    quantity: 2000,
    unit: "kg",
    unitPrice: 0.5,
    reorderLevel: 1000,
    status: "In Stock",
  },
]
