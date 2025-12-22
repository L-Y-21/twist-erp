import { Entity, Column, OneToMany, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity"

export enum VendorType {
  SUPPLIER = "supplier",
  CONTRACTOR = "contractor",
  SERVICE_PROVIDER = "service_provider",
}

export enum PaymentTerm {
  IMMEDIATE = "immediate",
  NET_15 = "net_15",
  NET_30 = "net_30",
  NET_45 = "net_45",
  NET_60 = "net_60",
  NET_90 = "net_90",
}

@Entity("vendors")
@Index(["code"], { unique: true })
export class Vendor extends BaseEntity {
  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column({
    type: "enum",
    enum: VendorType,
    default: VendorType.SUPPLIER,
  })
  type: VendorType

  @Column({ nullable: true })
  contactPerson: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  mobile: string

  @Column({ type: "text", nullable: true })
  address: string

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

  @Column({ nullable: true })
  bankName: string

  @Column({ nullable: true })
  accountNumber: string

  @Column({ nullable: true })
  ifscCode: string

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

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  rating: number

  @Column({ type: "text", nullable: true })
  notes: string

  @Column({ default: true })
  isActive: boolean

  @OneToMany(
    () => PurchaseOrder,
    (po) => po.vendor,
  )
  purchaseOrders: PurchaseOrder[]
}
