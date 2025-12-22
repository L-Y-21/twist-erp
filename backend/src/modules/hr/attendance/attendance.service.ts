import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Attendance } from "./entities/attendance.entity"

@Injectable()
export class AttendanceService {
  constructor(private attendanceRepository: Repository<Attendance>) {}

  async findByEmployee(employeeId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    return this.attendanceRepository
      .createQueryBuilder("attendance")
      .where("attendance.employeeId = :employeeId", { employeeId })
      .andWhere("attendance.date >= :startDate", { startDate })
      .andWhere("attendance.date <= :endDate", { endDate })
      .orderBy("attendance.date", "DESC")
      .getMany()
  }
}
