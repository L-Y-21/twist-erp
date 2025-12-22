import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"

@Entity("departments")
export class Department extends BaseEntity {
  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ nullable: true })
  parentDepartmentId: string

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: "parentDepartmentId" })
  parentDepartment: Department

  @Column({ nullable: true })
  headOfDepartment: string

  @Column({ default: true })
  isActive: boolean
}
