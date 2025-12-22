import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { QuotationItem } from "./quotation-item.entity"
import { Customer } from "../../customers/entities/customer.entity"

export enum QuotationStatus {
  DRAFT = "draft",
  SENT = "sent",
  VIEWED = "viewed",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
  CONVERTED = "converted",
}

@Entity("quotations")
@Index(["quotationNumber"], { unique: true })
@Index(["customer", "status"])
export class Quotation extends BaseEntity {
  @Column({ unique: true })
  quotationNumber: string

  @Column({ type: "date" })
  quotationDate: Date

  @Column({ type: "date" })
  validUntil: Date

  @Column({
    type: "enum",
    enum: QuotationStatus,
    default: QuotationStatus.DRAFT,
  })
  status: QuotationStatus

  @Column({ name: "customer_id" })
  customerId: string

  @ManyToOne(
    () => Customer,
    (customer) => customer.quotations,
  )
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @Column({ nullable: true })
  leadId: string

  @Column({ nullable: true })
  projectId: string

  @Column({ nullable: true })
  contactPerson: string

  @Column({ type: "text", nullable: true })
  subject: string

  @Column({ type: "text", nullable: true })
  terms: string

  @Column({ type: "text", nullable: true })
  notes: string

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  subtotal: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  taxAmount: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  discount: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  totalAmount: number

  @Column({ name: "prepared_by" })
  preparedBy: string

  @OneToMany(
    () => QuotationItem,
    (item) => item.quotation,
    { cascade: true },
  )
  items: QuotationItem[]
}
