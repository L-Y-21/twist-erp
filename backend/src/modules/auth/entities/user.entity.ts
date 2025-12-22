import { Entity, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn } from "typeorm"
import { Exclude } from "class-transformer"
import { BaseEntity } from "../../../common/entities/base.entity"
import { Role } from "../../roles/entities/role.entity"
import { Company } from "../../companies/entities/company.entity"

@Entity("users")
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string

  @Column()
  @Exclude()
  password: string

  @Column({ name: "first_name" })
  firstName: string

  @Column({ name: "last_name" })
  lastName: string

  @Column({ nullable: true })
  phone?: string

  @Column({ nullable: true })
  avatar?: string

  @Column({ default: true, name: "is_active" })
  isActive: boolean

  @Column({ default: false, name: "is_super_admin" })
  isSuperAdmin: boolean

  @Column({ type: "timestamp", nullable: true, name: "last_login" })
  lastLogin?: Date

  @Column({ type: "uuid", name: "company_id" })
  companyId: string

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn({ name: "company_id" })
  company: Company

  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
  })
  roles: Role[]

  @Column({ type: "text", nullable: true, name: "refresh_token" })
  @Exclude()
  refreshToken?: string
}
