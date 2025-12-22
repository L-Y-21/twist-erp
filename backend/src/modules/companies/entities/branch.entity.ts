import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "../../../common/entities/base.entity"
import { Company } from "./company.entity"

@Entity("branches")
export class Branch extends BaseEntity {
  @Column()
  name: string

  @Column()
  code: string

  @Column({ nullable: true })
  address?: string

  @Column({ nullable: true })
  city?: string

  @Column({ nullable: true })
  phone?: string

  @Column({ nullable: true })
  email?: string

  @Column({ default: true, name: "is_active" })
  isActive: boolean

  @Column({ type: "uuid", name: "company_id" })
  companyId: string

  @ManyToOne(
    () => Company,
    (company) => company.branches,
  )
  @JoinColumn({ name: "company_id" })
  company: Company
}
