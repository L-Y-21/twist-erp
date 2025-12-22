import { apiClient } from "../api-client"

export interface Project {
  id: string
  projectCode: string
  name: string
  description?: string
  customerId: string
  status: "planning" | "active" | "on_hold" | "completed" | "cancelled"
  startDate: string
  endDate: string
  budget: number
  actualCost: number
  progress: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProjectDto {
  projectCode: string
  name: string
  description?: string
  customerId: string
  status?: string
  startDate: string
  endDate: string
  budget: number
  isActive?: boolean
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export const projectsApi = {
  getAll: () => apiClient.get<Project[]>("/projects"),
  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),
  create: (data: CreateProjectDto) => apiClient.post<Project>("/projects", data),
  update: (id: string, data: UpdateProjectDto) => apiClient.patch<Project>(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/projects/${id}`),
}
