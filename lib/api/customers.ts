import { apiClient } from "../api-client"

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  creditLimit: number
  outstandingBalance: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerDto {
  name: string
  email?: string
  phone?: string
  address?: string
  creditLimit?: number
  isActive?: boolean
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

export const customersApi = {
  getAll: () => apiClient.get<Customer[]>("/customers"),
  getById: (id: string) => apiClient.get<Customer>(`/customers/${id}`),
  create: (data: CreateCustomerDto) => apiClient.post<Customer>("/customers", data),
  update: (id: string, data: UpdateCustomerDto) => apiClient.patch<Customer>(`/customers/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/customers/${id}`),
}
