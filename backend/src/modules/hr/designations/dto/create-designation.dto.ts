import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator"

export class CreateDesignationDto {
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
  @IsBoolean()
  isActive?: boolean
}
