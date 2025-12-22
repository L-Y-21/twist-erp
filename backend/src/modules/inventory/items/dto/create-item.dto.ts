import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, IsBoolean, Min } from "class-validator"
import { ItemType, ValuationMethod } from "../entities/item.entity"

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsNotEmpty()
  @IsEnum(ItemType)
  type: ItemType

  @IsNotEmpty()
  @IsString()
  categoryId: string

  @IsNotEmpty()
  @IsString()
  unitId: string

  @IsNotEmpty()
  @IsEnum(ValuationMethod)
  valuationMethod: ValuationMethod

  @IsOptional()
  @IsNumber()
  @Min(0)
  standardCost?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  sellingPrice?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderLevel?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderQuantity?: number

  @IsOptional()
  @IsBoolean()
  isBatchTracked?: boolean

  @IsOptional()
  @IsBoolean()
  isSerialTracked?: boolean

  @IsOptional()
  @IsBoolean()
  hasExpiryDate?: boolean

  @IsOptional()
  @IsString()
  hsnCode?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number

  @IsOptional()
  @IsString()
  barcode?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
