import { apiClient } from "../api-client"

export interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  position: string
  departmentId: string
  designationId: string
  status: "active" | "inactive"
  hireDate: string
  salary: number
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeDto {
  name: string
  email: string
  phone: string
  position: string
  departmentId: string
  designationId: string
  hireDate: string
  salary: number
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {}

export const employeesApi = {
  getAll: () => apiClient.get<Employee[]>("/employees"),
  getById: (id: string) => apiClient.get<Employee>(`/employees/${id}`),
  create: (data: CreateEmployeeDto) => apiClient.post<Employee>("/employees", data),
  update: (id: string, data: UpdateEmployeeDto) => apiClient.patch<Employee>(`/employees/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/employees/${id}`),
}
