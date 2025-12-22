import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { PurchaseOrderItem } from "./purchase-order-item.entity"
import { Vendor } from "../../vendors/entities/vendor.entity"
import { GoodsReceivedNote } from "../../grn/entities/goods-received-note.entity"

export enum PurchaseOrderStatus {
  DRAFT = "draft",
  PENDING_APPROVAL = "pending_approval",
  APPROVED = "approved",
  SENT = "sent",
  PARTIALLY_RECEIVED = "partially_received",
  RECEIVED = "received",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

@Entity("purchase_orders")
@Index(["orderNumber"], { unique: true })
@Index(["vendor", "status", "orderDate"])
export class PurchaseOrder extends BaseEntity {
  @Column({ unique: true })
  orderNumber: string

  @Column({ type: "date" })
  orderDate: Date

  @Column({ type: "date" })
  expectedDeliveryDate: Date

  @Column({
    type: "enum",
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus

  @Column({ name: "vendor_id" })
  vendorId: string

  @ManyToOne(
    () => Vendor,
    (vendor) => vendor.purchaseOrders,
  )
  @JoinColumn({ name: "vendor_id" })
  vendor: Vendor

  @Column({ nullable: true })
  vendorQuotationRef: string

  @Column({ nullable: true })
  requisitionId: string

  @Column({ nullable: true })
  projectId: string

  @Column({ nullable: true })
  deliveryWarehouseId: string

  @Column({ type: "text", nullable: true })
  deliveryAddress: string

  @Column({ type: "text", nullable: true })
  billingAddress: string

  @Column({ type: "text", nullable: true })
  terms: string

  @Column({ type: "text", nullable: true })
  remarks: string

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  subtotal: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  taxAmount: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  otherCharges: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  discount: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  totalAmount: number

  @Column({ name: "created_by" })
  createdBy: string

  @Column({ name: "approved_by", nullable: true })
  approvedBy: string

  @Column({ type: "timestamp", nullable: true })
  approvedDate: Date

  @OneToMany(
    () => PurchaseOrderItem,
    (item) => item.purchaseOrder,
    { cascade: true },
  )
  items: PurchaseOrderItem[]

  @OneToMany(
    () => GoodsReceivedNote,
    (grn) => grn.purchaseOrder,
  )
  grns: GoodsReceivedNote[]
}
