import { IsNotEmpty, IsString, IsOptional, IsEmail, IsNumber, Min, IsEnum, IsBoolean } from "class-validator"

enum VendorType {
  SUPPLIER = "supplier",
  CONTRACTOR = "contractor",
  SERVICE_PROVIDER = "service_provider",
  MANUFACTURER = "manufacturer",
}

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEnum(VendorType)
  type: VendorType

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
  @IsString()
  bankName?: string

  @IsOptional()
  @IsString()
  bankAccountNumber?: string

  @IsOptional()
  @IsString()
  ifscCode?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  creditLimit?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  creditDays?: number

  @IsOptional()
  @IsNumber()
  @Min(1)
  rating?: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
