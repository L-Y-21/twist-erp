const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

interface ApiError {
  message: string
  statusCode: number
}

import { simulateApi } from "./api/simulation"

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    console.log(`[v0] Simulating request: ${options.method || "GET"} ${endpoint}`)

    // Basic routing for simulation
    if (endpoint.startsWith("/inventory/items")) {
      if (options.method === "POST")
        return simulateApi.inventory.create(JSON.parse(options.body as string)) as Promise<T>
      if (options.method === "PUT" || options.method === "PATCH") {
        const id = endpoint.split("/").pop()!
        return simulateApi.inventory.update(id, JSON.parse(options.body as string)) as Promise<T>
      }
      if (options.method === "DELETE") {
        const id = endpoint.split("/").pop()!
        return simulateApi.inventory.delete(id) as Promise<T>
      }
      return simulateApi.inventory.getAll() as Promise<T>
    }

    if (endpoint.startsWith("/projects")) {
      if (options.method === "POST")
        return simulateApi.projects.create(JSON.parse(options.body as string)) as Promise<T>
      if (options.method === "PUT" || options.method === "PATCH") {
        const id = endpoint.split("/").pop()!
        return simulateApi.projects.update(id, JSON.parse(options.body as string)) as Promise<T>
      }
      if (options.method === "DELETE") {
        const id = endpoint.split("/").pop()!
        return simulateApi.projects.delete(id) as Promise<T>
      }
      return simulateApi.projects.getAll() as Promise<T>
    }

    // Default simulation for permissions/etc
    if (endpoint === "/auth/permissions") {
      return simulateApi.getPermissions() as Promise<T>
    }

    // Mock generic success for other endpoints
    return { success: true, data: [] } as Promise<T>
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient("")
