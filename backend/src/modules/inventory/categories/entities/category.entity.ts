import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Tree, TreeParent, TreeChildren } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Item } from "../../items/entities/item.entity"

@Entity("categories")
@Tree("materialized-path")
export class Category extends BaseEntity {
  @Column()
  name: string

  @Column({ unique: true })
  code: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ nullable: true })
  parentId: string

  @TreeParent()
  @ManyToOne(
    () => Category,
    (category) => category.children,
    { nullable: true },
  )
  @JoinColumn({ name: "parentId" })
  parent: Category

  @TreeChildren()
  @OneToMany(
    () => Category,
    (category) => category.parent,
  )
  children: Category[]

  @Column({ default: true })
  isActive: boolean

  @OneToMany(
    () => Item,
    (item) => item.category,
  )
  items: Item[]
}
