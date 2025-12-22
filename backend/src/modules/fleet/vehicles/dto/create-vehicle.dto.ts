import { IsNotEmpty, IsString, IsEnum, IsOptional, IsNumber, IsDateString } from "class-validator"
import { VehicleType, OwnershipType } from "../entities/vehicle.entity"

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  registrationNumber: string

  @IsNotEmpty()
  @IsEnum(VehicleType)
  type: VehicleType

  @IsOptional()
  @IsString()
  make?: string

  @IsOptional()
  @IsString()
  model?: string

  @IsOptional()
  @IsNumber()
  year?: number

  @IsOptional()
  @IsEnum(OwnershipType)
  ownershipType?: OwnershipType

  @IsOptional()
  @IsDateString()
  purchaseDate?: string

  @IsOptional()
  @IsNumber()
  purchasePrice?: number

  @IsOptional()
  @IsString()
  chassisNumber?: string

  @IsOptional()
  @IsString()
  engineNumber?: string

  @IsOptional()
  @IsString()
  fuelType?: string

  @IsOptional()
  @IsNumber()
  fuelCapacity?: number
}
