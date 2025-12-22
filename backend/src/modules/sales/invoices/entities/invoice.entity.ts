import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { InvoiceItem } from "./invoice-item.entity"
import { Customer } from "../../customers/entities/customer.entity"
import { SalesOrder } from "../../sales-orders/entities/sales-order.entity"
import { Payment } from "../../payments/entities/payment.entity"

export enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  PARTIALLY_PAID = "partially_paid",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
  VOID = "void",
}

@Entity("invoices")
@Index(["invoiceNumber"], { unique: true })
@Index(["customer", "status"])
export class Invoice extends BaseEntity {
  @Column({ unique: true })
  invoiceNumber: string

  @Column({ type: "date" })
  invoiceDate: Date

  @Column({ type: "date" })
  dueDate: Date

  @Column({
    type: "enum",
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus

  @Column({ name: "customer_id" })
  customerId: string

  @ManyToOne(
    () => Customer,
    (customer) => customer.salesOrders,
  )
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @Column({ name: "sales_order_id", nullable: true })
  salesOrderId: string

  @ManyToOne(
    () => SalesOrder,
    (order) => order.invoices,
    { nullable: true },
  )
  @JoinColumn({ name: "sales_order_id" })
  salesOrder: SalesOrder

  @Column({ nullable: true })
  projectId: string

  @Column({ type: "text", nullable: true })
  billingAddress: string

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

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  paidAmount: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  balanceAmount: number

  @Column({ name: "created_by" })
  createdBy: string

  @OneToMany(
    () => InvoiceItem,
    (item) => item.invoice,
    { cascade: true },
  )
  items: InvoiceItem[]

  @OneToMany(
    () => Payment,
    (payment) => payment.invoice,
  )
  payments: Payment[]
}
