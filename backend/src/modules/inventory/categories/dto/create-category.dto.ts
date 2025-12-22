import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator"

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  parentId?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
