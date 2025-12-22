import { apiClient } from "../api-client"

export interface Item {
  id: string
  name: string
  code: string
  description?: string
  categoryId: string
  unitId: string
  reorderLevel: number
  minStockLevel: number
  maxStockLevel: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateItemDto {
  name: string
  code: string
  description?: string
  categoryId: string
  unitId: string
  reorderLevel?: number
  minStockLevel?: number
  maxStockLevel?: number
  isActive?: boolean
}

export interface UpdateItemDto extends Partial<CreateItemDto> {}

export const itemsApi = {
  getAll: () => apiClient.get<Item[]>("/items"),
  getById: (id: string) => apiClient.get<Item>(`/items/${id}`),
  create: (data: CreateItemDto) => apiClient.post<Item>("/items", data),
  update: (id: string, data: UpdateItemDto) => apiClient.patch<Item>(`/items/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/items/${id}`),
}
