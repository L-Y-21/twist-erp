"use client"

import { useState } from "react"
import { ErpLayout } from "@/components/erp-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CrudModal } from "@/components/crud-modal"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { ViewSwitcher } from "@/components/view-switcher"
import { DataTable, SortableHeader } from "@/components/data-table"
import { PrintTemplate } from "@/components/print-template"
import { navigationConfig } from "@/lib/navigation"
import { Plus, Search, Download, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { generateId, simulateDelay, formatCurrency } from "@/lib/utils"

interface Payroll {
  id: string
  employeeId: string
  employeeName: string
  department: string
  month: string
  basicSalary: number
  allowances: number
  deductions: number
  netSalary: number
  status: "pending" | "processed" | "paid"
  paidDate?: string
}

const mockPayroll: Payroll[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    employeeName: "John Admin",
    department: "IT",
    month: "2025-01",
    basicSalary: 75000,
    allowances: 5000,
    deductions: 8000,
    netSalary: 72000,
    status: "paid",
    paidDate: "2025-01-05",
  },
  {
    id: "2",
    employeeId: "EMP-002",
    employeeName: "Sarah Manager",
    department: "Operations",
    month: "2025-01",
    basicSalary: 85000,
    allowances: 7000,
    deductions: 10000,
    netSalary: 82000,
    status: "processed",
  },
  {
    id: "3",
    employeeId: "EMP-003",
    employeeName: "Mike Tech",
    department: "Maintenance",
    month: "2025-01",
    basicSalary: 55000,
    allowances: 3000,
    deductions: 6000,
    netSalary: 52000,
    status: "pending",
  },
]

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<Payroll[]>(mockPayroll)
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"grid" | "table">("table")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [currentPayroll, setCurrentPayroll] = useState<Payroll | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    month: new Date().toISOString().slice(0, 7),
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
  })

  const filteredPayroll = payroll.filter(
    (p) =>
      p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdd = () => {
    setFormData({
      employeeId: "",
      employeeName: "",
      department: "",
      month: new Date().toISOString().slice(0, 7),
      basicSalary: 0,
      allowances: 0,
      deductions: 0,
    })
    setIsAddModalOpen(true)
  }

  const handleSubmitAdd = async () => {
    if (!formData.employeeId || !formData.month) {
      toast.error("Please fill in required fields")
      return
    }

    setIsLoading(true)
    await simulateDelay(1000)

    const netSalary = formData.basicSalary + formData.allowances - formData.deductions

    const newPayroll: Payroll = {
      id: generateId(),
      ...formData,
      netSalary,
      status: "pending",
    }

    setPayroll([newPayroll, ...payroll])
    setIsAddModalOpen(false)
    setIsLoading(false)
    toast.success("Payroll record created successfully")
  }

  const handleProcessPayroll = async (id: string) => {
    setIsLoading(true)
    await simulateDelay(1000)

    setPayroll(payroll.map((p) => (p.id === id ? { ...p, status: "processed" as const } : p)))
    setIsLoading(false)
    toast.success("Payroll processed successfully")
  }

  const handlePaySalary = async (id: string) => {
    setIsLoading(true)
    await simulateDelay(1000)

    setPayroll(
      payroll.map((p) =>
        p.id === id ? { ...p, status: "paid" as const, paidDate: new Date().toISOString().split("T")[0] } : p,
      ),
    )
    setIsLoading(false)
    toast.success("Salary paid successfully")
  }

  const handlePrintPayslip = (payrollRecord: Payroll) => {
    setCurrentPayroll(payrollRecord)
    setIsPrintModalOpen(true)
  }

  const columns = [
    {
      accessorKey: "employeeId",
      header: ({ column }: any) => <SortableHeader column={column}>Employee ID</SortableHeader>,
    },
    {
      accessorKey: "employeeName",
      header: ({ column }: any) => <SortableHeader column={column}>Name</SortableHeader>,
    },
    {
      accessorKey: "month",
      header: ({ column }: any) => <SortableHeader column={column}>Month</SortableHeader>,
    },
    {
      accessorKey: "basicSalary",
      header: "Basic Salary",
      cell: ({ row }: any) => formatCurrency(row.original.basicSalary),
    },
    {
      accessorKey: "netSalary",
      header: "Net Salary",
      cell: ({ row }: any) => <span className="font-semibold">{formatCurrency(row.original.netSalary)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.original.status
        return (
          <Badge variant={status === "paid" ? "default" : status === "processed" ? "secondary" : "outline"}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const record = row.original
        return (
          <div className="flex gap-2">
            {record.status === "pending" && (
              <Button size="sm" variant="outline" onClick={() => handleProcessPayroll(record.id)}>
                Process
              </Button>
            )}
            {record.status === "processed" && (
              <Button size="sm" onClick={() => handlePaySalary(record.id)}>
                Pay
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => handlePrintPayslip(record)}>
              Payslip
            </Button>
          </div>
        )
      },
    },
  ]

  const stats = {
    total: payroll.reduce((sum, p) => sum + p.netSalary, 0),
    pending: payroll.filter((p) => p.status === "pending").length,
    processed: payroll.filter((p) => p.status === "processed").length,
    paid: payroll.filter((p) => p.status === "paid").length,
  }

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Payroll Management</h1>
            <p className="text-muted-foreground">Manage employee payroll and salary payments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success("Payroll report exported")}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payroll
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Payroll</div>
            <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Processed</div>
            <div className="text-2xl font-bold text-blue-600">{stats.processed}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Paid</div>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payroll..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <ViewSwitcher view={view} onViewChange={setView} />
          </div>

          {view === "table" ? (
            <DataTable columns={columns} data={filteredPayroll} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPayroll.map((record) => (
                <Card key={record.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{record.employeeName}</h3>
                      <p className="text-sm text-muted-foreground">{record.employeeId}</p>
                    </div>
                    <Badge
                      variant={
                        record.status === "paid" ? "default" : record.status === "processed" ? "secondary" : "outline"
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {record.month}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Basic:</span>
                      <span>{formatCurrency(record.basicSalary)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Allowances:</span>
                      <span className="text-green-600">+{formatCurrency(record.allowances)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Deductions:</span>
                      <span className="text-red-600">-{formatCurrency(record.deductions)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t font-semibold">
                      <span>Net Salary:</span>
                      <span className="text-primary">{formatCurrency(record.netSalary)}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      {record.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProcessPayroll(record.id)}
                          className="flex-1"
                        >
                          Process
                        </Button>
                      )}
                      {record.status === "processed" && (
                        <Button size="sm" onClick={() => handlePaySalary(record.id)} className="flex-1">
                          Pay Now
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handlePrintPayslip(record)}>
                        Payslip
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      <CrudModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Create Payroll Record"
        description="Add new payroll entry for an employee"
        onSubmit={handleSubmitAdd}
        isLoading={isLoading}
        submitLabel="Create Payroll"
      >
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormFieldWrapper label="Employee ID" required>
              <Input
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="EMP-001"
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Employee Name" required>
              <Input
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              />
            </FormFieldWrapper>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormFieldWrapper label="Department">
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <FormFieldWrapper label="Month" required>
              <Input
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              />
            </FormFieldWrapper>
          </div>
          <FormFieldWrapper label="Basic Salary" required>
            <Input
              type="number"
              value={formData.basicSalary}
              onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
            />
          </FormFieldWrapper>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormFieldWrapper label="Allowances">
              <Input
                type="number"
                value={formData.allowances}
                onChange={(e) => setFormData({ ...formData, allowances: Number(e.target.value) })}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Deductions">
              <Input
                type="number"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
              />
            </FormFieldWrapper>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Net Salary:</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(formData.basicSalary + formData.allowances - formData.deductions)}
              </span>
            </div>
          </div>
        </div>
      </CrudModal>

      {currentPayroll && (
        <CrudModal
          open={isPrintModalOpen}
          onOpenChange={setIsPrintModalOpen}
          title="Employee Payslip"
          onSubmit={() => setIsPrintModalOpen(false)}
          submitLabel="Close"
          size="xl"
        >
          <PrintTemplate
            title="PAYSLIP"
            subtitle={`For the month of ${currentPayroll.month}`}
            metadata={[
              { label: "Employee ID", value: currentPayroll.employeeId },
              { label: "Employee Name", value: currentPayroll.employeeName },
              { label: "Department", value: currentPayroll.department },
              { label: "Payment Date", value: currentPayroll.paidDate || "Not Paid Yet" },
            ]}
          >
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Earnings</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Basic Salary</span>
                    <span>{formatCurrency(currentPayroll.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Allowances</span>
                    <span>+{formatCurrency(currentPayroll.allowances)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Deductions</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-red-600">
                    <span>Total Deductions</span>
                    <span>-{formatCurrency(currentPayroll.deductions)}</span>
                  </div>
                </div>
              </div>
              <div className="border-t-2 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Net Salary</span>
                  <span className="text-primary">{formatCurrency(currentPayroll.netSalary)}</span>
                </div>
              </div>
            </div>
          </PrintTemplate>
        </CrudModal>
      )}
    </ErpLayout>
  )
}
