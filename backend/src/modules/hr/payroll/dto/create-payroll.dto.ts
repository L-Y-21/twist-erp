import { IsNotEmpty, IsString, IsNumber } from "class-validator"

export class CreatePayrollDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string

  @IsNotEmpty()
  @IsNumber()
  month: number

  @IsNotEmpty()
  @IsNumber()
  year: number
}
