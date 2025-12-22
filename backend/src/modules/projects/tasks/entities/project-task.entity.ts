import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Project } from "../../projects/entities/project.entity"

export enum TaskStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  ON_HOLD = "on_hold",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

@Entity("project_tasks")
@Index(["project", "status"])
export class ProjectTask extends BaseEntity {
  @Column({ name: "project_id" })
  projectId: string

  @ManyToOne(
    () => Project,
    (project) => project.tasks,
  )
  @JoinColumn({ name: "project_id" })
  project: Project

  @Column()
  taskName: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "date" })
  startDate: Date

  @Column({ type: "date" })
  endDate: Date

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.NOT_STARTED,
  })
  status: TaskStatus

  @Column({
    type: "enum",
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority

  @Column({ nullable: true })
  assignedTo: string

  @Column({ nullable: true })
  parentTaskId: string

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  completionPercentage: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  estimatedCost: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  actualCost: number

  @Column({ type: "int", default: 0 })
  estimatedDuration: number

  @Column({ type: "int", default: 0 })
  actualDuration: number

  @Column({ type: "text", nullable: true })
  notes: string
}
