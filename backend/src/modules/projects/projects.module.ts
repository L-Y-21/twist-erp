import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Project } from "./projects/entities/project.entity"
import { BOQ } from "./boq/entities/boq.entity"
import { BOQItem } from "./boq/entities/boq-item.entity"
import { ProjectTask } from "./tasks/entities/project-task.entity"
import { ProjectResource } from "./resources/entities/project-resource.entity"
import { ProgressBilling } from "./billing/entities/progress-billing.entity"
import { ProgressBillingItem } from "./billing/entities/progress-billing-item.entity"
import { ProjectsController } from "./projects/projects.controller"
import { BOQController } from "./boq/boq.controller"
import { ProjectTasksController } from "./tasks/project-tasks.controller"
import { ProjectResourcesController } from "./resources/project-resources.controller"
import { ProgressBillingController } from "./billing/progress-billing.controller"
import { ProjectsService } from "./projects/projects.service"
import { BOQService } from "./boq/boq.service"
import { ProjectTasksService } from "./tasks/project-tasks.service"
import { ProjectResourcesService } from "./resources/project-resources.service"
import { ProgressBillingService } from "./billing/progress-billing.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      BOQ,
      BOQItem,
      ProjectTask,
      ProjectResource,
      ProgressBilling,
      ProgressBillingItem,
    ]),
  ],
  controllers: [
    ProjectsController,
    BOQController,
    ProjectTasksController,
    ProjectResourcesController,
    ProgressBillingController,
  ],
  providers: [ProjectsService, BOQService, ProjectTasksService, ProjectResourcesService, ProgressBillingService],
  exports: [ProjectsService, BOQService],
})
export class ProjectsModule {}
