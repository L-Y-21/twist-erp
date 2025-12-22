import { apiClient } from "../api-client"

export interface Vehicle {
  id: string
  vehicleNumber: string
  name: string
  type: string
  plateNumber: string
  status: "available" | "in_use" | "maintenance" | "out_of_service"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateVehicleDto {
  vehicleNumber: string
  name: string
  type: string
  plateNumber: string
  status?: string
  isActive?: boolean
}

export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {}

export const vehiclesApi = {
  getAll: () => apiClient.get<Vehicle[]>("/vehicles"),
  getById: (id: string) => apiClient.get<Vehicle>(`/vehicles/${id}`),
  create: (data: CreateVehicleDto) => apiClient.post<Vehicle>("/vehicles", data),
  update: (id: string, data: UpdateVehicleDto) => apiClient.patch<Vehicle>(`/vehicles/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/vehicles/${id}`),
}
