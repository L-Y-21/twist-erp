import { Entity, Column, OneToMany } from "typeorm"
import { BaseEntity } from "../../../common/entities/base.entity"
import { Branch } from "./branch.entity"

@Entity("companies")
export class Company extends BaseEntity {
  @Column()
  name: string

  @Column({ unique: true })
  code: string

  @Column({ nullable: true })
  logo?: string

  @Column({ nullable: true })
  address?: string

  @Column({ nullable: true })
  city?: string

  @Column({ nullable: true })
  country?: string

  @Column({ nullable: true })
  phone?: string

  @Column({ nullable: true })
  email?: string

  @Column({ nullable: true })
  website?: string

  @Column({ nullable: true, name: "tax_number" })
  taxNumber?: string

  @Column({ nullable: true, name: "registration_number" })
  registrationNumber?: string

  @Column({ default: true, name: "is_active" })
  isActive: boolean

  @OneToMany(
    () => Branch,
    (branch) => branch.company,
  )
  branches: Branch[]

  @Column({ type: "jsonb", nullable: true })
  settings?: Record<string, any>
}
