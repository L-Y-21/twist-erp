import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
} from "class-validator"
import { Type } from "class-transformer"
import { TransactionReason } from "../entities/stock-transaction.entity"

class StockAdjustmentItemDto {
  @IsNotEmpty()
  @IsString()
  itemId: string

  @IsNotEmpty()
  @IsString()
  warehouseId: string

  @IsOptional()
  @IsString()
  locationId?: string

  @IsOptional()
  @IsString()
  batchNumber?: string

  @IsOptional()
  @IsString()
  serialNumber?: string

  @IsNotEmpty()
  @IsNumber()
  quantity: number

  @IsNotEmpty()
  @IsNumber()
  unitCost: number

  @IsOptional()
  @IsString()
  remarks?: string
}

export class CreateStockAdjustmentDto {
  @IsNotEmpty()
  @IsDateString()
  adjustmentDate: string

  @IsNotEmpty()
  @IsEnum(TransactionReason)
  reason: TransactionReason

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockAdjustmentItemDto)
  items: StockAdjustmentItemDto[]

  @IsOptional()
  @IsString()
  remarks?: string
}
