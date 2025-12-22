import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { BOQ } from "./boq.entity"
import { Item } from "../../../inventory/items/entities/item.entity"

@Entity("boq_items")
export class BOQItem extends BaseEntity {
  @Column({ name: "boq_id" })
  boqId: string

  @ManyToOne(
    () => BOQ,
    (boq) => boq.items,
  )
  @JoinColumn({ name: "boq_id" })
  boq: BOQ

  @Column()
  itemCode: string

  @Column({ type: "text" })
  description: string

  @Column({ nullable: true })
  category: string

  @Column()
  unit: string

  @Column({ type: "decimal", precision: 15, scale: 4 })
  estimatedQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  actualQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 2 })
  unitRate: number

  @Column({ type: "decimal", precision: 18, scale: 2 })
  estimatedAmount: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  actualAmount: number

  @Column({ type: "text", nullable: true })
  specifications: string

  @Column({ nullable: true })
  itemId: string

  @ManyToOne(() => Item, { nullable: true })
  @JoinColumn({ name: "itemId" })
  inventoryItem: Item

  @Column({ type: "text", nullable: true })
  remarks: string
}
