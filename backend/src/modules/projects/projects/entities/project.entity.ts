import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Customer } from "../../../sales/customers/entities/customer.entity"
import { BOQ } from "../../boq/entities/boq.entity"
import { ProjectResource } from "../../resources/entities/project-resource.entity"
import { ProjectTask } from "../../tasks/entities/project-task.entity"
import { ProgressBilling } from "../../billing/entities/progress-billing.entity"

export enum ProjectType {
  BUILDING = "building",
  ROAD = "road",
  BRIDGE = "bridge",
  INFRASTRUCTURE = "infrastructure",
  RENOVATION = "renovation",
  OTHER = "other",
}

export enum ProjectStatus {
  PLANNING = "planning",
  APPROVED = "approved",
  IN_PROGRESS = "in_progress",
  ON_HOLD = "on_hold",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity("projects")
@Index(["projectCode"], { unique: true })
@Index(["status", "startDate"])
export class Project extends BaseEntity {
  @Column({ unique: true })
  projectCode: string

  @Column()
  name: string

  @Column({
    type: "enum",
    enum: ProjectType,
  })
  type: ProjectType

  @Column({ nullable: true })
  customerId: string

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: "customerId" })
  customer: Customer

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "text", nullable: true })
  siteAddress: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  state: string

  @Column({ type: "date" })
  startDate: Date

  @Column({ type: "date" })
  endDate: Date

  @Column({
    type: "enum",
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
  })
  status: ProjectStatus

  @Column({ nullable: true })
  projectManager: string

  @Column({ nullable: true })
  siteEngineer: string

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  estimatedCost: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  actualCost: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  contractValue: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  billedAmount: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  completionPercentage: number

  @Column({ type: "text", nullable: true })
  notes: string

  @OneToMany(
    () => BOQ,
    (boq) => boq.project,
  )
  boqs: BOQ[]

  @OneToMany(
    () => ProjectResource,
    (resource) => resource.project,
  )
  resources: ProjectResource[]

  @OneToMany(
    () => ProjectTask,
    (task) => task.project,
  )
  tasks: ProjectTask[]

  @OneToMany(
    () => ProgressBilling,
    (billing) => billing.project,
  )
  progressBillings: ProgressBilling[]
}
