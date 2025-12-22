import { apiClient } from "../api-client"

export interface Vendor {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  creditLimit: number
  outstandingBalance: number
  rating: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateVendorDto {
  name: string
  email?: string
  phone?: string
  address?: string
  creditLimit?: number
  rating?: number
  isActive?: boolean
}

export interface UpdateVendorDto extends Partial<CreateVendorDto> {}

export const vendorsApi = {
  getAll: () => apiClient.get<Vendor[]>("/vendors"),
  getById: (id: string) => apiClient.get<Vendor>(`/vendors/${id}`),
  create: (data: CreateVendorDto) => apiClient.post<Vendor>("/vendors", data),
  update: (id: string, data: UpdateVendorDto) => apiClient.patch<Vendor>(`/vendors/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/vendors/${id}`),
}
