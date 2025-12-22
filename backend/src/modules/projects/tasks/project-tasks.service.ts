import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { ProjectTask } from "./entities/project-task.entity"

@Injectable()
export class ProjectTasksService {
  constructor(private taskRepository: Repository<ProjectTask>) {}

  async findByProject(projectId: string): Promise<ProjectTask[]> {
    return this.taskRepository.find({
      where: { projectId },
      order: { startDate: "ASC" },
    })
  }
}
