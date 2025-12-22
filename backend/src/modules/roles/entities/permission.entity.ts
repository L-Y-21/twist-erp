import { Entity, Column } from "typeorm"
import { BaseEntity } from "../../../common/entities/base.entity"

@Entity("permissions")
export class Permission extends BaseEntity {
  @Column({ unique: true })
  name: string

  @Column({ nullable: true })
  description?: string

  @Column()
  module: string

  @Column()
  action: string
}
