import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { ProjectResource } from "./entities/project-resource.entity"

@Injectable()
export class ProjectResourcesService {
  constructor(private resourceRepository: Repository<ProjectResource>) {}

  async findByProject(projectId: string): Promise<ProjectResource[]> {
    return this.resourceRepository.find({
      where: { projectId },
      order: { resourceName: "ASC" },
    })
  }
}
