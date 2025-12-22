import { IsNotEmpty, IsString, IsOptional, IsEmail, IsDateString, IsEnum, IsBoolean } from "class-validator"

enum EmploymentType {
  PERMANENT = "permanent",
  CONTRACT = "contract",
  TEMPORARY = "temporary",
  INTERN = "intern",
}

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsNotEmpty()
  @IsString()
  lastName: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsNotEmpty()
  @IsDateString()
  dateOfJoining: string

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string

  @IsNotEmpty()
  @IsString()
  departmentId: string

  @IsNotEmpty()
  @IsString()
  designationId: string

  @IsNotEmpty()
  @IsEnum(EmploymentType)
  employmentType: EmploymentType

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  state?: string

  @IsOptional()
  @IsString()
  country?: string

  @IsOptional()
  @IsString()
  pincode?: string

  @IsOptional()
  @IsString()
  emergencyContactName?: string

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string

  @IsOptional()
  @IsString()
  bankAccountNumber?: string

  @IsOptional()
  @IsString()
  ifscCode?: string

  @IsOptional()
  @IsString()
  panNumber?: string

  @IsOptional()
  @IsString()
  aadharNumber?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
