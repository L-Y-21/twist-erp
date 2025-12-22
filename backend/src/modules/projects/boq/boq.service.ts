import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository, DataSource } from "typeorm"
import { BOQ, BOQStatus } from "./entities/boq.entity"
import { BOQItem } from "./entities/boq-item.entity"
import type { CreateBOQDto } from "./dto/create-boq.dto"

@Injectable()
export class BOQService {
  constructor(
    private boqRepository: Repository<BOQ>,
    private boqItemRepository: Repository<BOQItem>,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateBOQDto, userId: string): Promise<BOQ> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const boqNumber = await this.generateBOQNumber()

      let totalEstimatedCost = 0

      const boq = queryRunner.manager.create(BOQ, {
        boqNumber,
        version: createDto.version || "1.0",
        projectId: createDto.projectId,
        preparedDate: createDto.preparedDate,
        preparedBy: userId,
        notes: createDto.notes,
        status: BOQStatus.DRAFT,
      })

      await queryRunner.manager.save(boq)

      // Create items
      for (const itemDto of createDto.items) {
        const estimatedAmount = Number(itemDto.estimatedQuantity) * Number(itemDto.unitRate)
        totalEstimatedCost += estimatedAmount

        const item = queryRunner.manager.create(BOQItem, {
          boqId: boq.id,
          itemCode: itemDto.itemCode,
          description: itemDto.description,
          category: itemDto.category,
          unit: itemDto.unit,
          estimatedQuantity: itemDto.estimatedQuantity,
          unitRate: itemDto.unitRate,
          estimatedAmount,
          specifications: itemDto.specifications,
          itemId: itemDto.itemId,
          remarks: itemDto.remarks,
        })
        await queryRunner.manager.save(item)
      }

      boq.totalEstimatedCost = totalEstimatedCost
      await queryRunner.manager.save(boq)

      await queryRunner.commitTransaction()

      return this.findOne(boq.id)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async findAll(filters?: any): Promise<BOQ[]> {
    const query = this.boqRepository
      .createQueryBuilder("boq")
      .leftJoinAndSelect("boq.project", "project")
      .leftJoinAndSelect("boq.items", "items")
      .orderBy("boq.preparedDate", "DESC")

    if (filters?.projectId) {
      query.andWhere("boq.projectId = :projectId", { projectId: filters.projectId })
    }

    if (filters?.status) {
      query.andWhere("boq.status = :status", { status: filters.status })
    }

    return query.getMany()
  }

  async findOne(id: string): Promise<BOQ> {
    const boq = await this.boqRepository.findOne({
      where: { id },
      relations: ["project", "items", "items.inventoryItem"],
    })

    if (!boq) {
      throw new NotFoundException(`BOQ with ID ${id} not found`)
    }

    return boq
  }

  async approve(id: string, userId: string): Promise<BOQ> {
    const boq = await this.findOne(id)
    boq.status = BOQStatus.APPROVED
    boq.approvedBy = userId
    boq.approvedDate = new Date()
    return this.boqRepository.save(boq)
  }

  private async generateBOQNumber(): Promise<string> {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")

    const lastBOQ = await this.boqRepository
      .createQueryBuilder("boq")
      .where("boq.boqNumber LIKE :prefix", { prefix: `BOQ${year}${month}%` })
      .orderBy("boq.boqNumber", "DESC")
      .getOne()

    let sequence = 1
    if (lastBOQ) {
      const lastSeq = Number.parseInt(lastBOQ.boqNumber.slice(-4))
      sequence = lastSeq + 1
    }

    return `BOQ${year}${month}${sequence.toString().padStart(4, "0")}`
  }
}
