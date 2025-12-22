import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Vehicle } from "./vehicles/entities/vehicle.entity"
import { Driver } from "./drivers/entities/driver.entity"
import { FuelEntry } from "./fuel/entities/fuel-entry.entity"
import { MaintenanceRecord } from "./maintenance/entities/maintenance-record.entity"
import { VehicleAssignment } from "./assignments/entities/vehicle-assignment.entity"
import { Asset } from "./assets/entities/asset.entity"
import { AssetMaintenance } from "./assets/entities/asset-maintenance.entity"
import { VehiclesController } from "./vehicles/vehicles.controller"
import { DriversController } from "./drivers/drivers.controller"
import { FuelController } from "./fuel/fuel.controller"
import { MaintenanceController } from "./maintenance/maintenance.controller"
import { VehicleAssignmentsController } from "./assignments/vehicle-assignments.controller"
import { AssetsController } from "./assets/assets.controller"
import { VehiclesService } from "./vehicles/vehicles.service"
import { DriversService } from "./drivers/drivers.service"
import { FuelService } from "./fuel/fuel.service"
import { MaintenanceService } from "./maintenance/maintenance.service"
import { VehicleAssignmentsService } from "./assignments/vehicle-assignments.service"
import { AssetsService } from "./assets/assets.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vehicle,
      Driver,
      FuelEntry,
      MaintenanceRecord,
      VehicleAssignment,
      Asset,
      AssetMaintenance,
    ]),
  ],
  controllers: [
    VehiclesController,
    DriversController,
    FuelController,
    MaintenanceController,
    VehicleAssignmentsController,
    AssetsController,
  ],
  providers: [
    VehiclesService,
    DriversService,
    FuelService,
    MaintenanceService,
    VehicleAssignmentsService,
    AssetsService,
  ],
  exports: [VehiclesService, DriversService],
})
export class FleetModule {}
