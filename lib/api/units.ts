import { apiClient } from "../api-client"

export interface Unit {
  id: string
  name: string
  abbreviation: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUnitDto {
  name: string
  abbreviation: string
  isActive?: boolean
}

export interface UpdateUnitDto extends Partial<CreateUnitDto> {}

export const unitsApi = {
  getAll: () => apiClient.get<Unit[]>("/units"),
  getById: (id: string) => apiClient.get<Unit>(`/units/${id}`),
  create: (data: CreateUnitDto) => apiClient.post<Unit>("/units", data),
  update: (id: string, data: UpdateUnitDto) => apiClient.patch<Unit>(`/units/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/units/${id}`),
}
