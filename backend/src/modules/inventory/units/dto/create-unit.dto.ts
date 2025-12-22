import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, Min } from "class-validator"

export class CreateUnitDto {
  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  symbol?: string

  @IsOptional()
  @IsString()
  baseUnitId?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  conversionFactor?: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
