import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository, DataSource } from "typeorm"
import { Payroll, PayrollStatus } from "./entities/payroll.entity"
import { PayrollComponent, ComponentType } from "./entities/payroll-component.entity"
import type { Employee } from "../employees/entities/employee.entity"
import type { Attendance, AttendanceStatus } from "../attendance/entities/attendance.entity"
import type { CreatePayrollDto } from "./dto/create-payroll.dto"

@Injectable()
export class PayrollService {
  constructor(
    private payrollRepository: Repository<Payroll>,
    private payrollComponentRepository: Repository<PayrollComponent>,
    private employeeRepository: Repository<Employee>,
    private attendanceRepository: Repository<Attendance>,
    private dataSource: DataSource,
  ) {}

  async generatePayroll(dto: CreatePayrollDto, userId: string): Promise<Payroll> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const employee = await this.employeeRepository.findOne({
        where: { id: dto.employeeId },
      })

      if (!employee) {
        throw new NotFoundException("Employee not found")
      }

      // Check if payroll already exists
      const existing = await this.payrollRepository.findOne({
        where: {
          employeeId: dto.employeeId,
          month: dto.month,
          year: dto.year,
        },
      })

      if (existing) {
        throw new BadRequestException("Payroll already exists for this period")
      }

      // Calculate attendance
      const startDate = new Date(dto.year, dto.month - 1, 1)
      const endDate = new Date(dto.year, dto.month, 0)
      const workingDays = this.getWorkingDays(startDate, endDate)

      const attendances = await this.attendanceRepository.find({
        where: {
          employeeId: dto.employeeId,
        },
      })

      const attendanceInPeriod = attendances.filter((a) => {
        const date = new Date(a.date)
        return date >= startDate && date <= endDate
      })

      const presentDays = attendanceInPeriod.filter(
        (a) => a.status === ("PRESENT" as AttendanceStatus) || a.status === ("LATE" as AttendanceStatus),
      ).length
      const halfDays = attendanceInPeriod.filter((a) => a.status === ("HALF_DAY" as AttendanceStatus)).length
      const leaveDays = attendanceInPeriod.filter((a) => a.status === ("ON_LEAVE" as AttendanceStatus)).length
      const absentDays = workingDays - presentDays - halfDays * 0.5 - leaveDays

      const paidDays = presentDays + halfDays * 0.5 + leaveDays

      // Calculate salary
      const perDaySalary = Number(employee.basicSalary) / workingDays
      const basicSalary = perDaySalary * paidDays

      // Earnings
      const hra = basicSalary * 0.4 // 40% of basic
      const conveyance = 1600 // Fixed
      const medicalAllowance = 1250 // Fixed
      const totalEarnings = basicSalary + hra + conveyance + medicalAllowance

      // Deductions
      const pf = basicSalary * 0.12 // 12% of basic
      const esi = totalEarnings <= 21000 ? totalEarnings * 0.0075 : 0 // 0.75% if <= 21000
      const professionalTax = totalEarnings > 10000 ? 200 : 0
      const totalDeductions = pf + esi + professionalTax

      const grossSalary = totalEarnings
      const netSalary = grossSalary - totalDeductions

      // Create payroll
      const payroll = queryRunner.manager.create(Payroll, {
        employeeId: dto.employeeId,
        month: dto.month,
        year: dto.year,
        payPeriodStart: startDate,
        payPeriodEnd: endDate,
        workingDays,
        presentDays,
        absentDays,
        leaveDays,
        paidDays,
        basicSalary,
        totalEarnings,
        totalDeductions,
        grossSalary,
        netSalary,
        processedBy: userId,
        processedDate: new Date(),
        status: PayrollStatus.PROCESSED,
      })

      await queryRunner.manager.save(payroll)

      // Create components
      const components = [
        { code: "BASIC", name: "Basic Salary", type: ComponentType.EARNING, amount: basicSalary },
        { code: "HRA", name: "House Rent Allowance", type: ComponentType.EARNING, amount: hra },
        { code: "CONV", name: "Conveyance", type: ComponentType.EARNING, amount: conveyance },
        { code: "MED", name: "Medical Allowance", type: ComponentType.EARNING, amount: medicalAllowance },
        { code: "PF", name: "Provident Fund", type: ComponentType.DEDUCTION, amount: pf },
        { code: "ESI", name: "ESI", type: ComponentType.DEDUCTION, amount: esi },
        { code: "PT", name: "Professional Tax", type: ComponentType.DEDUCTION, amount: professionalTax },
      ]

      for (const comp of components) {
        if (comp.amount > 0) {
          const component = queryRunner.manager.create(PayrollComponent, {
            payrollId: payroll.id,
            componentCode: comp.code,
            componentName: comp.name,
            type: comp.type,
            amount: comp.amount,
          })
          await queryRunner.manager.save(component)
        }
      }

      await queryRunner.commitTransaction()

      return this.findOne(payroll.id)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async findAll(filters?: any): Promise<Payroll[]> {
    const query = this.payrollRepository
      .createQueryBuilder("payroll")
      .leftJoinAndSelect("payroll.employee", "employee")
      .leftJoinAndSelect("payroll.components", "components")
      .orderBy("payroll.year", "DESC")
      .addOrderBy("payroll.month", "DESC")

    if (filters?.employeeId) {
      query.andWhere("payroll.employeeId = :employeeId", {
        employeeId: filters.employeeId,
      })
    }

    if (filters?.month) {
      query.andWhere("payroll.month = :month", { month: filters.month })
    }

    if (filters?.year) {
      query.andWhere("payroll.year = :year", { year: filters.year })
    }

    if (filters?.status) {
      query.andWhere("payroll.status = :status", { status: filters.status })
    }

    return query.getMany()
  }

  async findOne(id: string): Promise<Payroll> {
    const payroll = await this.payrollRepository.findOne({
      where: { id },
      relations: ["employee", "components"],
    })

    if (!payroll) {
      throw new NotFoundException(`Payroll with ID ${id} not found`)
    }

    return payroll
  }

  async approve(id: string, userId: string): Promise<Payroll> {
    const payroll = await this.findOne(id)

    if (payroll.status !== PayrollStatus.PROCESSED) {
      throw new BadRequestException("Only processed payroll can be approved")
    }

    payroll.status = PayrollStatus.APPROVED
    payroll.approvedBy = userId
    payroll.approvedDate = new Date()

    return this.payrollRepository.save(payroll)
  }

  async markAsPaid(id: string, paymentDate: Date, paymentMethod: string, paymentReference: string): Promise<Payroll> {
    const payroll = await this.findOne(id)

    if (payroll.status !== PayrollStatus.APPROVED) {
      throw new BadRequestException("Only approved payroll can be marked as paid")
    }

    payroll.status = PayrollStatus.PAID
    payroll.paymentDate = paymentDate
    payroll.paymentMethod = paymentMethod
    payroll.paymentReference = paymentReference

    return this.payrollRepository.save(payroll)
  }

  private getWorkingDays(startDate: Date, endDate: Date): number {
    let workingDays = 0
    const current = new Date(startDate)

    while (current <= endDate) {
      const dayOfWeek = current.getDay()
      if (dayOfWeek !== 0) {
        // Exclude Sundays
        workingDays++
      }
      current.setDate(current.getDate() + 1)
    }

    return workingDays
  }
}
