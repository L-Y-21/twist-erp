import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { SalesOrderItem } from "./sales-order-item.entity"
import { Customer } from "../../customers/entities/customer.entity"
import { Invoice } from "../../invoices/entities/invoice.entity"

export enum SalesOrderStatus {
  DRAFT = "draft",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  PARTIALLY_DELIVERED = "partially_delivered",
  DELIVERED = "delivered",
  INVOICED = "invoiced",
  PARTIALLY_INVOICED = "partially_invoiced",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity("sales_orders")
@Index(["orderNumber"], { unique: true })
@Index(["customer", "status"])
export class SalesOrder extends BaseEntity {
  @Column({ unique: true })
  orderNumber: string

  @Column({ type: "date" })
  orderDate: Date

  @Column({ type: "date" })
  deliveryDate: Date

  @Column({
    type: "enum",
    enum: SalesOrderStatus,
    default: SalesOrderStatus.DRAFT,
  })
  status: SalesOrderStatus

  @Column({ name: "customer_id" })
  customerId: string

  @ManyToOne(
    () => Customer,
    (customer) => customer.salesOrders,
  )
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @Column({ nullable: true })
  quotationId: string

  @Column({ nullable: true })
  projectId: string

  @Column({ nullable: true })
  customerPONumber: string

  @Column({ type: "date", nullable: true })
  customerPODate: Date

  @Column({ type: "text", nullable: true })
  billingAddress: string

  @Column({ type: "text", nullable: true })
  shippingAddress: string

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

  @Column({ name: "created_by" })
  createdBy: string

  @OneToMany(
    () => SalesOrderItem,
    (item) => item.salesOrder,
    { cascade: true },
  )
  items: SalesOrderItem[]

  @OneToMany(
    () => Invoice,
    (invoice) => invoice.salesOrder,
  )
  invoices: Invoice[]
}
