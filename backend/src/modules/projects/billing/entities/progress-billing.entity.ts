import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Project } from "../../projects/entities/project.entity"
import { ProgressBillingItem } from "./progress-billing-item.entity"

export enum ProgressBillingStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  INVOICED = "invoiced",
  REJECTED = "rejected",
}

@Entity("progress_billings")
@Index(["billingNumber"], { unique: true })
@Index(["project", "status"])
export class ProgressBilling extends BaseEntity {
  @Column({ unique: true })
  billingNumber: string

  @Column({ name: "project_id" })
  projectId: string

  @ManyToOne(
    () => Project,
    (project) => project.progressBillings,
  )
  @JoinColumn({ name: "project_id" })
  project: Project

  @Column({ type: "date" })
  billingDate: Date

  @Column({ type: "date" })
  periodStart: Date

  @Column({ type: "date" })
  periodEnd: Date

  @Column({
    type: "enum",
    enum: ProgressBillingStatus,
    default: ProgressBillingStatus.DRAFT,
  })
  status: ProgressBillingStatus

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  completionPercentage: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  previousBilledAmount: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  currentBillingAmount: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  cumulativeBilledAmount: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  retentionAmount: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  retentionPercentage: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  netBillingAmount: number

  @Column({ nullable: true })
  preparedBy: string

  @Column({ nullable: true })
  approvedBy: string

  @Column({ type: "date", nullable: true })
  approvedDate: Date

  @Column({ nullable: true })
  invoiceId: string

  @Column({ type: "text", nullable: true })
  remarks: string

  @OneToMany(
    () => ProgressBillingItem,
    (item) => item.progressBilling,
    { cascade: true },
  )
  items: ProgressBillingItem[]
}
