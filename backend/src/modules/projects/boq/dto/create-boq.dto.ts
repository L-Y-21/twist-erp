import { IsNotEmpty, IsString, IsDateString, IsArray, ValidateNested, IsOptional, IsNumber } from "class-validator"
import { Type } from "class-transformer"

class BOQItemDto {
  @IsNotEmpty()
  @IsString()
  itemCode: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsOptional()
  @IsString()
  category?: string

  @IsNotEmpty()
  @IsString()
  unit: string

  @IsNotEmpty()
  @IsNumber()
  estimatedQuantity: number

  @IsNotEmpty()
  @IsNumber()
  unitRate: number

  @IsOptional()
  @IsString()
  specifications?: string

  @IsOptional()
  @IsString()
  itemId?: string

  @IsOptional()
  @IsString()
  remarks?: string
}

export class CreateBOQDto {
  @IsNotEmpty()
  @IsString()
  projectId: string

  @IsOptional()
  @IsString()
  version?: string

  @IsNotEmpty()
  @IsDateString()
  preparedDate: string

  @IsOptional()
  @IsString()
  notes?: string

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BOQItemDto)
  items: BOQItemDto[]
}
