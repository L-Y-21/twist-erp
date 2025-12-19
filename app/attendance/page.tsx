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
import { navigationConfig } from "@/lib/navigation"
import { Plus, Search, Upload, Download, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { generateId, simulateDelay, formatDate } from "@/lib/utils"

interface Attendance {
  id: string
  employeeId: string
  employeeName: string
  department: string
  date: string
  checkIn: string
  checkOut: string
  workHours: number
  status: "present" | "absent" | "late" | "half-day"
  notes: string
}

const mockAttendance: Attendance[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    employeeName: "John Admin",
    department: "IT",
    date: "2025-01-15",
    checkIn: "08:00",
    checkOut: "17:00",
    workHours: 9,
    status: "present",
    notes: "",
  },
  {
    id: "2",
    employeeId: "EMP-002",
    employeeName: "Sarah Manager",
    department: "Operations",
    date: "2025-01-15",
    checkIn: "08:30",
    checkOut: "17:30",
    workHours: 9,
    status: "late",
    notes: "Traffic delay",
  },
  {
    id: "3",
    employeeId: "EMP-003",
    employeeName: "Mike Tech",
    department: "Maintenance",
    date: "2025-01-15",
    checkIn: "",
    checkOut: "",
    workHours: 0,
    status: "absent",
    notes: "Sick leave",
  },
]

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance)
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"grid" | "table">("table")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    date: new Date().toISOString().split("T")[0],
    checkIn: "",
    checkOut: "",
    status: "present" as "present" | "absent" | "late" | "half-day",
    notes: "",
  })

  const filteredAttendance = attendance.filter(
    (att) =>
      att.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdd = () => {
    setFormData({
      employeeId: "",
      employeeName: "",
      department: "",
      date: new Date().toISOString().split("T")[0],
      checkIn: "",
      checkOut: "",
      status: "present",
      notes: "",
    })
    setIsAddModalOpen(true)
  }

  const handleSubmitAdd = async () => {
    if (!formData.employeeId || !formData.date) {
      toast.error("Please fill in required fields")
      return
    }

    setIsLoading(true)
    await simulateDelay(1000)

    const checkIn = formData.checkIn || "00:00"
    const checkOut = formData.checkOut || "00:00"
    const workHours = calculateWorkHours(checkIn, checkOut)

    const newAttendance: Attendance = {
      id: generateId(),
      ...formData,
      checkIn,
      checkOut,
      workHours,
    }

    setAttendance([newAttendance, ...attendance])
    setIsAddModalOpen(false)
    setIsLoading(false)
    toast.success("Attendance record added successfully")
  }

  const calculateWorkHours = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0
    const [inHour, inMin] = checkIn.split(":").map(Number)
    const [outHour, outMin] = checkOut.split(":").map(Number)
    const hours = outHour - inHour + (outMin - inMin) / 60
    return Math.max(0, Math.round(hours * 10) / 10)
  }

  const handleImportFromMachine = async () => {
    setIsLoading(true)
    await simulateDelay(2000)

    // Simulate reading from attendance machine
    const machineData: Attendance[] = [
      {
        id: generateId(),
        employeeId: "EMP-004",
        employeeName: "Alice Worker",
        department: "Operations",
        date: "2025-01-15",
        checkIn: "07:55",
        checkOut: "17:05",
        workHours: 9.2,
        status: "present",
        notes: "Imported from machine",
      },
      {
        id: generateId(),
        employeeId: "EMP-005",
        employeeName: "Bob Engineer",
        department: "IT",
        date: "2025-01-15",
        checkIn: "08:15",
        checkOut: "17:15",
        workHours: 9,
        status: "late",
        notes: "Imported from machine",
      },
    ]

    setAttendance([...machineData, ...attendance])
    setIsImportModalOpen(false)
    setIsLoading(false)
    toast.success(`Imported ${machineData.length} attendance records from machine`)
  }

  const handleExport = () => {
    toast.success("Attendance data exported to Excel")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "late":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "half-day":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
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
      accessorKey: "department",
      header: ({ column }: any) => <SortableHeader column={column}>Department</SortableHeader>,
    },
    {
      accessorKey: "date",
      header: ({ column }: any) => <SortableHeader column={column}>Date</SortableHeader>,
      cell: ({ row }: any) => formatDate(row.original.date),
    },
    {
      accessorKey: "checkIn",
      header: "Check In",
      cell: ({ row }: any) => row.original.checkIn || "-",
    },
    {
      accessorKey: "checkOut",
      header: "Check Out",
      cell: ({ row }: any) => row.original.checkOut || "-",
    },
    {
      accessorKey: "workHours",
      header: "Hours",
      cell: ({ row }: any) => `${row.original.workHours}h`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.original.status
        return (
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <Badge
              variant={
                status === "present"
                  ? "default"
                  : status === "absent"
                    ? "destructive"
                    : status === "late"
                      ? "secondary"
                      : "outline"
              }
            >
              {status}
            </Badge>
          </div>
        )
      },
    },
  ]

  const stats = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
  }

  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Attendance Management</h1>
            <p className="text-muted-foreground">Track employee attendance and timesheets</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import from Machine
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Records</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Present</div>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Absent</div>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Late</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search attendance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <ViewSwitcher view={view} onViewChange={setView} />
          </div>

          {view === "table" ? (
            <DataTable
              columns={columns}
              data={filteredAttendance}
              searchKey="employeeName"
              searchPlaceholder="Search employees..."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAttendance.map((att) => (
                <Card key={att.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{att.employeeName}</h3>
                      <p className="text-sm text-muted-foreground">{att.employeeId}</p>
                    </div>
                    {getStatusIcon(att.status)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(att.date)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Check In:</span>
                      <span className="font-medium">{att.checkIn || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Check Out:</span>
                      <span className="font-medium">{att.checkOut || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Work Hours:</span>
                      <span className="font-medium">{att.workHours}h</span>
                    </div>
                    <div className="pt-2">
                      <Badge
                        variant={
                          att.status === "present"
                            ? "default"
                            : att.status === "absent"
                              ? "destructive"
                              : att.status === "late"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {att.status}
                      </Badge>
                    </div>
                    {att.notes && <p className="text-xs text-muted-foreground italic">{att.notes}</p>}
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
        title="Add Attendance Record"
        description="Manually add an attendance record"
        onSubmit={handleSubmitAdd}
        isLoading={isLoading}
        submitLabel="Add Record"
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
            <FormFieldWrapper label="Date" required>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </FormFieldWrapper>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <FormFieldWrapper label="Check In">
              <Input
                type="time"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Check Out">
              <Input
                type="time"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Status">
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          </div>
          <FormFieldWrapper label="Notes">
            <Input
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes"
            />
          </FormFieldWrapper>
        </div>
      </CrudModal>

      <CrudModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        title="Import from Attendance Machine"
        description="Connect to attendance machine and import records"
        onSubmit={handleImportFromMachine}
        isLoading={isLoading}
        submitLabel="Import Records"
      >
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Machine Connection</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Configure your attendance machine connection settings. Supports ZKTeco, eSSL, and other biometric devices.
            </p>
            <div className="space-y-3">
              <FormFieldWrapper label="Machine IP Address">
                <Input placeholder="192.168.1.100" defaultValue="192.168.1.100" />
              </FormFieldWrapper>
              <FormFieldWrapper label="Port">
                <Input placeholder="4370" defaultValue="4370" />
              </FormFieldWrapper>
              <FormFieldWrapper label="Date Range">
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
              </FormFieldWrapper>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Click "Import Records" to connect to the machine and fetch attendance data.
          </div>
        </div>
      </CrudModal>
    </ErpLayout>
  )
}
