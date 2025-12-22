import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Category } from "../../categories/entities/category.entity"

@Entity("items")
export class Item extends BaseEntity {
  @Column()
  code: string

  @Column()
  name: string

  @Column({ nullable: true })
  description?: string

  @Column({ type: "uuid", name: "category_id" })
  categoryId: string

  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id" })
  category: Category

  @Column({ name: "unit_of_measure" })
  unitOfMeasure: string

  @Column({ type: "decimal", precision: 10, scale: 2, name: "unit_price", default: 0 })
  unitPrice: number

  @Column({ type: "decimal", precision: 10, scale: 2, name: "cost_price", default: 0 })
  costPrice: number

  @Column({ name: "reorder_level", default: 0 })
  reorderLevel: number

  @Column({ name: "max_stock_level", nullable: true })
  maxStockLevel?: number

  @Column({ name: "lead_time_days", default\
