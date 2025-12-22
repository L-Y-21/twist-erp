import { IsNotEmpty, IsString, IsOptional, IsEmail, IsNumber, Min, IsEnum, IsBoolean } from "class-validator"

enum CustomerType {
  INDIVIDUAL = "individual",
  COMPANY = "company",
  GOVERNMENT = "government",
}

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEnum(CustomerType)
  type: CustomerType

  @IsOptional()
  @IsString()
  contactPerson?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  phone?: string

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
  gstNumber?: string

  @IsOptional()
  @IsString()
  panNumber?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  creditLimit?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  creditDays?: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
