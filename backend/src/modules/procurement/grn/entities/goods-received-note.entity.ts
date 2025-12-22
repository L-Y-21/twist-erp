import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { GoodsReceivedNoteItem } from "./goods-received-note-item.entity"
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity"

export enum GRNStatus {
  DRAFT = "draft",
  RECEIVED = "received",
  QUALITY_CHECK = "quality_check",
  ACCEPTED = "accepted",
  PARTIALLY_ACCEPTED = "partially_accepted",
  REJECTED = "rejected",
}

@Entity("goods_received_notes")
@Index(["grnNumber"], { unique: true })
@Index(["purchaseOrder", "status", "receivedDate"])
export class GoodsReceivedNote extends BaseEntity {
  @Column({ unique: true })
  grnNumber: string

  @Column({ type: "timestamp" })
  receivedDate: Date

  @Column({
    type: "enum",
    enum: GRNStatus,
    default: GRNStatus.DRAFT,
  })
  status: GRNStatus

  @Column({ name: "purchase_order_id" })
  purchaseOrderId: string

  @ManyToOne(
    () => PurchaseOrder,
    (po) => po.grns,
  )
  @JoinColumn({ name: "purchase_order_id" })
  purchaseOrder: PurchaseOrder

  @Column()
  warehouseId: string

  @Column({ nullable: true })
  vehicleNumber: string

  @Column({ nullable: true })
  driverName: string

  @Column({ nullable: true })
  driverPhone: string

  @Column({ nullable: true })
  invoiceNumber: string

  @Column({ type: "date", nullable: true })
  invoiceDate: Date

  @Column({ type: "decimal", precision: 18, scale: 2, nullable: true })
  invoiceAmount: number

  @Column({ nullable: true })
  challanNumber: string

  @Column({ type: "date", nullable: true })
  challanDate: Date

  @Column({ name: "received_by" })
  receivedBy: string

  @Column({ name: "inspected_by", nullable: true })
  inspectedBy: string

  @Column({ type: "timestamp", nullable: true })
  inspectionDate: Date

  @Column({ type: "text", nullable: true })
  inspectionRemarks: string

  @Column({ type: "text", nullable: true })
  remarks: string

  @OneToMany(
    () => GoodsReceivedNoteItem,
    (item) => item.grn,
    { cascade: true },
  )
  items: GoodsReceivedNoteItem[]
}
