import { apiClient } from "../api-client"

export interface Warehouse {
  id: string
  name: string
  code: string
  location: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateWarehouseDto {
  name: string
  code: string
  location: string
  isActive?: boolean
}

export interface UpdateWarehouseDto extends Partial<CreateWarehouseDto> {}

export const warehousesApi = {
  getAll: () => apiClient.get<Warehouse[]>("/warehouses"),
  getById: (id: string) => apiClient.get<Warehouse>(`/warehouses/${id}`),
  create: (data: CreateWarehouseDto) => apiClient.post<Warehouse>("/warehouses", data),
  update: (id: string, data: UpdateWarehouseDto) => apiClient.patch<Warehouse>(`/warehouses/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/warehouses/${id}`),
}
