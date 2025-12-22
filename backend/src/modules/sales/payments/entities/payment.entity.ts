import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Customer } from "../../customers/entities/customer.entity"
import { Invoice } from "../../invoices/entities/invoice.entity"

export enum PaymentMethod {
  CASH = "cash",
  CHEQUE = "cheque",
  BANK_TRANSFER = "bank_transfer",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  UPI = "upi",
  WALLET = "wallet",
  OTHER = "other",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

@Entity("payments")
@Index(["paymentNumber"], { unique: true })
@Index(["customer", "paymentDate"])
export class Payment extends BaseEntity {
  @Column({ unique: true })
  paymentNumber: string

  @Column({ type: "date" })
  paymentDate: Date

  @Column({ name: "customer_id" })
  customerId: string

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @Column({ name: "invoice_id", nullable: true })
  invoiceId: string

  @ManyToOne(
    () => Invoice,
    (invoice) => invoice.payments,
    { nullable: true },
  )
  @JoinColumn({ name: "invoice_id" })
  invoice: Invoice

  @Column({ type: "decimal", precision: 18, scale: 2 })
  amount: number

  @Column({
    type: "enum",
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.COMPLETED,
  })
  status: PaymentStatus

  @Column({ nullable: true })
  referenceNumber: string

  @Column({ nullable: true })
  bankName: string

  @Column({ nullable: true })
  chequeNumber: string

  @Column({ type: "date", nullable: true })
  chequeDate: Date

  @Column({ type: "text", nullable: true })
  notes: string

  @Column({ name: "received_by" })
  receivedBy: string
}
