import { Entity, Column } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"

@Entity("designations")
export class Designation extends BaseEntity {
  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ nullable: true })
  departmentId: string

  @Column({ type: "int", default: 1 })
  level: number

  @Column({ default: true })
  isActive: boolean
}
