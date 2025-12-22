import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type Project, ProjectStatus } from "./entities/project.entity"
import type { CreateProjectDto } from "./dto/create-project.dto"
import type { UpdateProjectDto } from "./dto/update-project.dto"

@Injectable()
export class ProjectsService {
  constructor(private projectRepository: Repository<Project>) {}

  async create(createDto: CreateProjectDto): Promise<Project> {
    const projectCode = await this.generateProjectCode()

    const project = this.projectRepository.create({
      ...createDto,
      projectCode,
    })

    return this.projectRepository.save(project)
  }

  async findAll(filters?: any): Promise<Project[]> {
    const query = this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.customer", "customer")
      .orderBy("project.startDate", "DESC")

    if (filters?.status) {
      query.andWhere("project.status = :status", { status: filters.status })
    }

    if (filters?.customerId) {
      query.andWhere("project.customerId = :customerId", {
        customerId: filters.customerId,
      })
    }

    if (filters?.projectManager) {
      query.andWhere("project.projectManager = :projectManager", {
        projectManager: filters.projectManager,
      })
    }

    return query.getMany()
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ["customer", "boqs", "tasks", "resources"],
    })

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`)
    }

    return project
  }

  async update(id: string, updateDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id)
    Object.assign(project, updateDto)
    return this.projectRepository.save(project)
  }

  async updateProgress(id: string, completionPercentage: number): Promise<Project> {
    const project = await this.findOne(id)
    project.completionPercentage = completionPercentage

    if (completionPercentage >= 100) {
      project.status = ProjectStatus.COMPLETED
    } else if (completionPercentage > 0 && project.status === ProjectStatus.APPROVED) {
      project.status = ProjectStatus.IN_PROGRESS
    }

    return this.projectRepository.save(project)
  }

  private async generateProjectCode(): Promise<string> {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)

    const lastProject = await this.projectRepository
      .createQueryBuilder("project")
      .where("project.projectCode LIKE :prefix", { prefix: `PRJ${year}%` })
      .orderBy("project.projectCode", "DESC")
      .getOne()

    let sequence = 1
    if (lastProject) {
      const lastSeq = Number.parseInt(lastProject.projectCode.slice(-4))
      sequence = lastSeq + 1
    }

    return `PRJ${year}${sequence.toString().padStart(4, "0")}`
  }

  async getProjectDashboard(id: string) {
    const project = await this.findOne(id)

    const totalTasks = project.tasks.length
    const completedTasks = project.tasks.filter((t) => t.status === "completed").length
    const inProgressTasks = project.tasks.filter((t) => t.status === "in_progress").length

    const totalEstimated = Number(project.estimatedCost)
    const totalActual = Number(project.actualCost)
    const variance = totalEstimated - totalActual
    const variancePercent = totalEstimated > 0 ? (variance / totalEstimated) * 100 : 0

    return {
      project,
      summary: {
        completionPercentage: project.completionPercentage,
        totalTasks,
        completedTasks,
        inProgressTasks,
        estimatedCost: totalEstimated,
        actualCost: totalActual,
        costVariance: variance,
        costVariancePercent: variancePercent,
        contractValue: Number(project.contractValue),
        billedAmount: Number(project.billedAmount),
        unbilledAmount: Number(project.contractValue) - Number(project.billedAmount),
      },
    }
  }
}
