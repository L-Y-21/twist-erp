import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Project } from "../../projects/entities/project.entity"

export enum ResourceType {
  MATERIAL = "material",
  EQUIPMENT = "equipment",
  LABOR = "labor",
  SUBCONTRACTOR = "subcontractor",
}

@Entity("project_resources")
@Index(["project", "resourceType"])
export class ProjectResource extends BaseEntity {
  @Column({ name: "project_id" })
  projectId: string

  @ManyToOne(
    () => Project,
    (project) => project.resources,
  )
  @JoinColumn({ name: "project_id" })
  project: Project

  @Column({
    type: "enum",
    enum: ResourceType,
  })
  resourceType: ResourceType

  @Column()
  resourceName: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ nullable: true })
  unit: string

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  plannedQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  actualQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  unitCost: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  plannedCost: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  actualCost: number

  @Column({ type: "date", nullable: true })
  startDate: Date

  @Column({ type: "date", nullable: true })
  endDate: Date

  @Column({ nullable: true })
  vendorId: string

  @Column({ nullable: true })
  itemId: string

  @Column({ type: "text", nullable: true })
  remarks: string
}
