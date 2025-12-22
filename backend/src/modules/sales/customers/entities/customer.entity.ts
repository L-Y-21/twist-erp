import { Entity, Column, OneToMany, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Lead } from "../../leads/entities/lead.entity"
import { Quotation } from "../../quotations/entities/quotation.entity"
import { SalesOrder } from "../../sales-orders/entities/sales-order.entity"

export enum CustomerType {
  INDIVIDUAL = "individual",
  COMPANY = "company",
  GOVERNMENT = "government",
}

export enum PaymentTerm {
  IMMEDIATE = "immediate",
  NET_15 = "net_15",
  NET_30 = "net_30",
  NET_45 = "net_45",
  NET_60 = "net_60",
  NET_90 = "net_90",
}

@Entity("customers")
@Index(["code"], { unique: true })
export class Customer extends BaseEntity {
  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column({
    type: "enum",
    enum: CustomerType,
    default: CustomerType.INDIVIDUAL,
  })
  type: CustomerType

  @Column({ nullable: true })
  contactPerson: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  mobile: string

  @Column({ type: "text", nullable: true })
  billingAddress: string

  @Column({ type: "text", nullable: true })
  shippingAddress: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  state: string

  @Column({ nullable: true })
  country: string

  @Column({ nullable: true })
  pincode: string

  @Column({ nullable: true })
  gstNumber: string

  @Column({ nullable: true })
  panNumber: string

  @Column({
    type: "enum",
    enum: PaymentTerm,
    default: PaymentTerm.NET_30,
  })
  paymentTerms: PaymentTerm

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  creditLimit: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  outstandingBalance: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  totalSales: number

  @Column({ type: "text", nullable: true })
  notes: string

  @Column({ default: true })
  isActive: boolean

  @OneToMany(
    () => Lead,
    (lead) => lead.customer,
  )
  leads: Lead[]

  @OneToMany(
    () => Quotation,
    (quotation) => quotation.customer,
  )
  quotations: Quotation[]

  @OneToMany(
    () => SalesOrder,
    (order) => order.customer,
  )
  salesOrders: SalesOrder[]
}
