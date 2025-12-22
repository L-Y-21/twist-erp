import { IsNotEmpty, IsString, IsDateString, IsArray, ValidateNested, IsOptional, IsNumber } from "class-validator"
import { Type } from "class-transformer"

class PurchaseOrderItemDto {
  @IsNotEmpty()
  @IsString()
  itemId: string

  @IsOptional()
  @IsString()
  description?: string

  @IsNotEmpty()
  @IsNumber()
  quantity: number

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number

  @IsNotEmpty()
  @IsNumber()
  taxRate: number

  @IsOptional()
  @IsString()
  hsnCode?: string

  @IsOptional()
  @IsString()
  specifications?: string

  @IsOptional()
  @IsString()
  remarks?: string
}

export class CreatePurchaseOrderDto {
  @IsNotEmpty()
  @IsDateString()
  orderDate: string

  @IsNotEmpty()
  @IsDateString()
  expectedDeliveryDate: string

  @IsNotEmpty()
  @IsString()
  vendorId: string

  @IsOptional()
  @IsString()
  vendorQuotationRef?: string

  @IsOptional()
  @IsString()
  requisitionId?: string

  @IsOptional()
  @IsString()
  projectId?: string

  @IsOptional()
  @IsString()
  deliveryWarehouseId?: string

  @IsOptional()
  @IsString()
  deliveryAddress?: string

  @IsOptional()
  @IsString()
  billingAddress?: string

  @IsOptional()
  @IsString()
  terms?: string

  @IsOptional()
  @IsString()
  remarks?: string

  @IsOptional()
  @IsNumber()
  otherCharges?: number

  @IsOptional()
  @IsNumber()
  discount?: number

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[]
}
