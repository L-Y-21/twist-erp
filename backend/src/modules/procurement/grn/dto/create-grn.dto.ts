import { IsNotEmpty, IsString, IsDateString, IsArray, ValidateNested, IsOptional, IsNumber } from "class-validator"
import { Type } from "class-transformer"

class CreateGRNItemDto {
  @IsNotEmpty()
  @IsString()
  purchaseOrderItemId: string

  @IsNotEmpty()
  @IsNumber()
  receivedQuantity: number

  @IsOptional()
  @IsNumber()
  acceptedQuantity?: number

  @IsOptional()
  @IsNumber()
  rejectedQuantity?: number

  @IsOptional()
  @IsString()
  batchNumber?: string

  @IsOptional()
  @IsString()
  serialNumber?: string

  @IsOptional()
  @IsDateString()
  manufacturingDate?: string

  @IsOptional()
  @IsDateString()
  expiryDate?: string

  @IsOptional()
  @IsString()
  locationId?: string

  @IsOptional()
  @IsString()
  rejectionReason?: string

  @IsOptional()
  @IsString()
  remarks?: string
}

export class CreateGRNDto {
  @IsNotEmpty()
  @IsDateString()
  receivedDate: string

  @IsNotEmpty()
  @IsString()
  purchaseOrderId: string

  @IsNotEmpty()
  @IsString()
  warehouseId: string

  @IsOptional()
  @IsString()
  vehicleNumber?: string

  @IsOptional()
  @IsString()
  driverName?: string

  @IsOptional()
  @IsString()
  driverPhone?: string

  @IsOptional()
  @IsString()
  invoiceNumber?: string

  @IsOptional()
  @IsDateString()
  invoiceDate?: string

  @IsOptional()
  @IsNumber()
  invoiceAmount?: number

  @IsOptional()
  @IsString()
  challanNumber?: string

  @IsOptional()
  @IsDateString()
  challanDate?: string

  @IsOptional()
  @IsString()
  remarks?: string

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGRNItemDto)
  items: CreateGRNItemDto[]
}
