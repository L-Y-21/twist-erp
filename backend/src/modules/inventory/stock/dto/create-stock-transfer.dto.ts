import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsArray, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

class StockTransferItemDto {
  @IsNotEmpty()
  @IsString()
  itemId: string

  @IsOptional()
  @IsString()
  batchNumber?: string

  @IsOptional()
  @IsString()
  serialNumber?: string

  @IsNotEmpty()
  @IsNumber()
  quantity: number

  @IsOptional()
  @IsString()
  remarks?: string
}

export class CreateStockTransferDto {
  @IsNotEmpty()
  @IsString()
  fromWarehouseId: string

  @IsNotEmpty()
  @IsString()
  toWarehouseId: string

  @IsOptional()
  @IsString()
  fromLocationId?: string

  @IsOptional()
  @IsString()
  toLocationId?: string

  @IsNotEmpty()
  @IsDateString()
  transferDate: string

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockTransferItemDto)
  items: StockTransferItemDto[]

  @IsOptional()
  @IsString()
  remarks?: string
}
