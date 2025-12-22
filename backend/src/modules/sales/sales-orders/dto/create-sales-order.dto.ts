import { IsNotEmpty, IsString, IsDateString, IsArray, ValidateNested, IsOptional, IsNumber } from "class-validator"
import { Type } from "class-transformer"

class SalesOrderItemDto {
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
  warehouseId?: string

  @IsOptional()
  @IsString()
  specifications?: string
}

export class CreateSalesOrderDto {
  @IsNotEmpty()
  @IsDateString()
  orderDate: string

  @IsNotEmpty()
  @IsDateString()
  deliveryDate: string

  @IsNotEmpty()
  @IsString()
  customerId: string

  @IsOptional()
  @IsString()
  quotationId?: string

  @IsOptional()
  @IsString()
  projectId?: string

  @IsOptional()
  @IsString()
  customerPONumber?: string

  @IsOptional()
  @IsDateString()
  customerPODate?: string

  @IsOptional()
  @IsString()
  billingAddress?: string

  @IsOptional()
  @IsString()
  shippingAddress?: string

  @IsOptional()
  @IsString()
  terms?: string

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  @IsNumber()
  discount?: number

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalesOrderItemDto)
  items: SalesOrderItemDto[]
}
