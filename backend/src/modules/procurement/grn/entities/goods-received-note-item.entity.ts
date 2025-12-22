import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { GoodsReceivedNote } from "./goods-received-note.entity"
import { Item } from "../../../inventory/items/entities/item.entity"

export enum InspectionStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  HOLD = "hold",
}

@Entity("goods_received_note_items")
export class GoodsReceivedNoteItem extends BaseEntity {
  @Column({ name: "grn_id" })
  grnId: string

  @ManyToOne(
    () => GoodsReceivedNote,
    (grn) => grn.items,
  )
  @JoinColumn({ name: "grn_id" })
  grn: GoodsReceivedNote

  @Column({ name: "purchase_order_item_id" })
  purchaseOrderItemId: string

  @Column({ name: "item_id" })
  itemId: string

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item

  @Column({ type: "decimal", precision: 15, scale: 4 })
  orderedQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4 })
  receivedQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  acceptedQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  rejectedQuantity: number

  @Column({
    type: "enum",
    enum: InspectionStatus,
    default: InspectionStatus.PENDING,
  })
  inspectionStatus: InspectionStatus

  @Column({ nullable: true })
  batchNumber: string

  @Column({ nullable: true })
  serialNumber: string

  @Column({ type: "date", nullable: true })
  manufacturingDate: Date

  @Column({ type: "date", nullable: true })
  expiryDate: Date

  @Column({ nullable: true })
  locationId: string

  @Column({ type: "decimal", precision: 15, scale: 2 })
  unitPrice: number

  @Column({ type: "text", nullable: true })
  rejectionReason: string

  @Column({ type: "text", nullable: true })
  remarks: string
}
