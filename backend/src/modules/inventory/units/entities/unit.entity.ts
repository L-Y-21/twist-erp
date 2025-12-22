import { Entity, Column, OneToMany } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Item } from "../../items/entities/item.entity"

@Entity("units")
export class Unit extends BaseEntity {
  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column({ nullable: true })
  symbol: string

  @Column({ type: "decimal", precision: 10, scale: 6, default: 1 })
  conversionFactor: number

  @Column({ nullable: true })
  baseUnitId: string

  @Column({ default: true })
  isActive: boolean

  @OneToMany(
    () => Item,
    (item) => item.unit,
  )
  items: Item[]
}
