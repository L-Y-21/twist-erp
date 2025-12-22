import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Project } from "../../projects/entities/project.entity"
import { BOQItem } from "./boq-item.entity"

export enum BOQStatus {
  DRAFT = "draft",
  APPROVED = "approved",
  REVISED = "revised",
  FINALIZED = "finalized",
}

@Entity("boqs")
@Index(["boqNumber"], { unique: true })
export class BOQ extends BaseEntity {
  @Column({ unique: true })
  boqNumber: string

  @Column({ nullable: true })
  version: string

  @Column({ name: "project_id" })
  projectId: string

  @ManyToOne(
    () => Project,
    (project) => project.boqs,
  )
  @JoinColumn({ name: "project_id" })
  project: Project

  @Column({ type: "date" })
  preparedDate: Date

  @Column({
    type: "enum",
    enum: BOQStatus,
    default: BOQStatus.DRAFT,
  })
  status: BOQStatus

  @Column({ nullable: true })
  preparedBy: string

  @Column({ nullable: true })
  approvedBy: string

  @Column({ type: "date", nullable: true })
  approvedDate: Date

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  totalEstimatedCost: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  totalActualCost: number

  @Column({ type: "text", nullable: true })
  notes: string

  @OneToMany(
    () => BOQItem,
    (item) => item.boq,
    { cascade: true },
  )
  items: BOQItem[]
}
