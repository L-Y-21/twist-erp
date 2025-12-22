import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Customer } from "../../customers/entities/customer.entity"

export enum LeadSource {
  WEBSITE = "website",
  REFERRAL = "referral",
  SOCIAL_MEDIA = "social_media",
  ADVERTISEMENT = "advertisement",
  EXHIBITION = "exhibition",
  COLD_CALL = "cold_call",
  WALK_IN = "walk_in",
  OTHER = "other",
}

export enum LeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  PROPOSAL = "proposal",
  NEGOTIATION = "negotiation",
  WON = "won",
  LOST = "lost",
  CANCELLED = "cancelled",
}

@Entity("leads")
@Index(["status", "createdAt"])
export class Lead extends BaseEntity {
  @Column()
  leadNumber: string

  @Column()
  companyName: string

  @Column()
  contactPerson: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  mobile: string

  @Column({
    type: "enum",
    enum: LeadSource,
  })
  source: LeadSource

  @Column({
    type: "enum",
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus

  @Column({ type: "text", nullable: true })
  requirement: string

  @Column({ type: "decimal", precision: 18, scale: 2, nullable: true })
  estimatedValue: number

  @Column({ type: "date", nullable: true })
  expectedClosureDate: Date

  @Column({ nullable: true })
  assignedTo: string

  @Column({ nullable: true })
  customerId: string

  @ManyToOne(
    () => Customer,
    (customer) => customer.leads,
    { nullable: true },
  )
  @JoinColumn({ name: "customerId" })
  customer: Customer

  @Column({ type: "text", nullable: true })
  notes: string

  @Column({ type: "text", nullable: true })
  lostReason: string
}
