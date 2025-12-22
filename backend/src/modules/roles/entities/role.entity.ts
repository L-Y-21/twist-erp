import { Entity, Column, ManyToMany, JoinTable } from "typeorm"
import { BaseEntity } from "../../../common/entities/base.entity"
import { Permission } from "./permission.entity"

@Entity("roles")
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string

  @Column({ nullable: true })
  description?: string

  @Column({ name: "company_id", type: "uuid" })
  companyId: string

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
  })
  permissions: Permission[]
}
