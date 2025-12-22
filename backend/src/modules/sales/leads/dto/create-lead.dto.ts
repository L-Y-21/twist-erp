import { IsNotEmpty, IsString, IsOptional, IsEmail, IsEnum } from "class-validator"

enum LeadSource {
  WEBSITE = "website",
  REFERRAL = "referral",
  COLD_CALL = "cold_call",
  MARKETING = "marketing",
  SOCIAL_MEDIA = "social_media",
  OTHER = "other",
}

enum LeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  PROPOSAL = "proposal",
  NEGOTIATION = "negotiation",
  WON = "won",
  LOST = "lost",
}

export class CreateLeadDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  contactName: string

  @IsOptional()
  @IsString()
  companyName?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsNotEmpty()
  @IsEnum(LeadSource)
  source: LeadSource

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  @IsString()
  assignedToId?: string
}
