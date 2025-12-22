import { IsNotEmpty, IsString, IsDateString, IsArray, ValidateNested, IsOptional, IsNumber } from "class-validator"
import { Type } from "class-transformer"

class InvoiceItemDto {
  @IsOptional()
  @IsString()
  itemId?: string

  @IsNotEmpty()
  @IsString()
  description: string

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
}

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsDateString()
  invoiceDate: string

  @IsNotEmpty()
  @IsDateString()
  dueDate: string

  @IsNotEmpty()
  @IsString()
  customerId: string

  @IsOptional()
  @IsString()
  salesOrderId?: string

  @IsOptional()
  @IsString()
  projectId?: string

  @IsOptional()
  @IsString()
  billingAddress?: string

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
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[]
}
