import { IsNotEmpty, IsString, IsEnum, IsDateString, IsOptional, IsNumber } from "class-validator"
import { ProjectType } from "../entities/project.entity"

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEnum(ProjectType)
  type: ProjectType

  @IsOptional()
  @IsString()
  customerId?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  siteAddress?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  state?: string

  @IsNotEmpty()
  @IsDateString()
  startDate: string

  @IsNotEmpty()
  @IsDateString()
  endDate: string

  @IsOptional()
  @IsString()
  projectManager?: string

  @IsOptional()
  @IsString()
  siteEngineer?: string

  @IsOptional()
  @IsNumber()
  estimatedCost?: number

  @IsOptional()
  @IsNumber()
  contractValue?: number

  @IsOptional()
  @IsString()
  notes?: string
}
