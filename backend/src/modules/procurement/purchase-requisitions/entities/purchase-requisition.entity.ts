import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { PurchaseRequisitionItem } from "./purchase-requisition-item.entity"
import { User } from "../../../auth/entities/user.entity"

export enum RequisitionStatus {
  DRAFT = "draft",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  PARTIALLY_ORDERED = "partially_ordered",
  ORDERED = "ordered",
  CANCELLED = "cancelled",
}

export enum RequisitionPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

@Entity("purchase_requisitions")
@Index(["requisitionNumber"], { unique: true })
@Index(["status", "requisitionDate"])
export class PurchaseRequisition extends BaseEntity {
  @Column({ unique: true })
  requisitionNumber: string

  @Column({ type: "date" })
  requisitionDate: Date

  @Column({ type: "date" })
  requiredDate: Date

  @Column({
    type: "enum",
    enum: RequisitionStatus,
    default: RequisitionStatus.DRAFT,
  })
  status: RequisitionStatus

  @Column({
    type: "enum",
    enum: RequisitionPriority,
    default: RequisitionPriority.MEDIUM,
  })
  priority: RequisitionPriority

  @Column({ nullable: true })
  departmentId: string

  @Column({ nullable: true })
  projectId: string

  @Column({ name: "requested_by" })
  requestedBy: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "requested_by" })
  requester: User

  @Column({ name: "approved_by", nullable: true })
  approvedBy: string

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "approved_by" })
  approver: User

  @Column({ type: "timestamp", nullable: true })
  approvedDate: Date

  @Column({ type: "text", nullable: true })
  purpose: string

  @Column({ type: "text", nullable: true })
  remarks: string

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  totalAmount: number

  @OneToMany(
    () => PurchaseRequisitionItem,
    (item) => item.requisition,
    { cascade: true },
  )
  items: PurchaseRequisitionItem[]
}
