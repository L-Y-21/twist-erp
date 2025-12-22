import { apiClient } from "../api-client"

export interface Category {
  id: string
  name: string
  code: string
  description?: string
  parentId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  code: string
  description?: string
  parentId?: string
  isActive?: boolean
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export const categoriesApi = {
  getAll: () => apiClient.get<Category[]>("/categories"),
  getById: (id: string) => apiClient.get<Category>(`/categories/${id}`),
  create: (data: CreateCategoryDto) => apiClient.post<Category>("/categories", data),
  update: (id: string, data: UpdateCategoryDto) => apiClient.patch<Category>(`/categories/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/categories/${id}`),
}
