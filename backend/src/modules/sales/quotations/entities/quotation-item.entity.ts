import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Quotation } from "./quotation.entity"
import { Item } from "../../../inventory/items/entities/item.entity"

@Entity("quotation_items")
export class QuotationItem extends BaseEntity {
  @Column({ name: "quotation_id" })
  quotationId: string

  @ManyToOne(
    () => Quotation,
    (quotation) => quotation.items,
  )
  @JoinColumn({ name: "quotation_id" })
  quotation: Quotation

  @Column({ name: "item_id", nullable: true })
  itemId: string

  @ManyToOne(() => Item, { nullable: true })
  @JoinColumn({ name: "item_id" })
  item: Item

  @Column({ type: "text" })
  description: string

  @Column({ type: "decimal", precision: 15, scale: 4 })
  quantity: number

  @Column({ nullable: true })
  unit: string

  @Column({ type: "decimal", precision: 15, scale: 2 })
  unitPrice: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  taxRate: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  taxAmount: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  discountPercent: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  discountAmount: number

  @Column({ type: "decimal", precision: 18, scale: 2 })
  totalAmount: number

  @Column({ type: "text", nullable: true })
  specifications: string
}
