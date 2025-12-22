import { IsNotEmpty, IsString, IsOptional, IsEmail, IsDateString, IsBoolean } from "class-validator"

export class CreateDriverDto {
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
  @IsString()
  licenseNumber: string

  @IsNotEmpty()
  @IsDateString()
  licenseExpiryDate: string

  @IsOptional()
  @IsString()
  licenseType?: string

  @IsOptional()
  @IsDateString()
  dateOfJoining?: string

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
  emergencyContactName?: string

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
