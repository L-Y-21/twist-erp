import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Employee } from "./employees/entities/employee.entity"
import { Department } from "./departments/entities/department.entity"
import { Designation } from "./designations/entities/designation.entity"
import { Attendance } from "./attendance/entities/attendance.entity"
import { Leave } from "./leave/entities/leave.entity"
import { LeaveBalance } from "./leave/entities/leave-balance.entity"
import { Payroll } from "./payroll/entities/payroll.entity"
import { PayrollComponent } from "./payroll/entities/payroll-component.entity"
import { EmployeesController } from "./employees/employees.controller"
import { DepartmentsController } from "./departments/departments.controller"
import { DesignationsController } from "./designations/designations.controller"
import { AttendanceController } from "./attendance/attendance.controller"
import { LeaveController } from "./leave/leave.controller"
import { PayrollController } from "./payroll/payroll.controller"
import { EmployeesService } from "./employees/employees.service"
import { DepartmentsService } from "./departments/departments.service"
import { DesignationsService } from "./designations/designations.service"
import { AttendanceService } from "./attendance/attendance.service"
import { LeaveService } from "./leave/leave.service"
import { PayrollService } from "./payroll/payroll.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Department,
      Designation,
      Attendance,
      Leave,
      LeaveBalance,
      Payroll,
      PayrollComponent,
    ]),
  ],
  controllers: [
    EmployeesController,
    DepartmentsController,
    DesignationsController,
    AttendanceController,
    LeaveController,
    PayrollController,
  ],
  providers: [
    EmployeesService,
    DepartmentsService,
    DesignationsService,
    AttendanceService,
    LeaveService,
    PayrollService,
  ],
  exports: [EmployeesService, AttendanceService, PayrollService],
})
export class HRModule {}
