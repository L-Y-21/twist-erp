import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Item } from "./items/entities/item.entity"
import { Category } from "./categories/entities/category.entity"
import { Unit } from "./units/entities/unit.entity"
import { Warehouse } from "./warehouses/entities/warehouse.entity"
import { Location } from "./warehouses/entities/location.entity"
import { StockLevel } from "./stock/entities/stock-level.entity"
import { StockTransaction } from "./stock/entities/stock-transaction.entity"
import { ItemsController } from "./items/items.controller"
import { CategoriesController } from "./categories/categories.controller"
import { UnitsController } from "./units/units.controller"
import { WarehousesController } from "./warehouses/warehouses.controller"
import { StockController } from "./stock/stock.controller"
import { ItemsService } from "./items/items.service"
import { CategoriesService } from "./categories/categories.service"
import { UnitsService } from "./units/units.service"
import { WarehousesService } from "./warehouses/warehouses.service"
import { StockService } from "./stock/stock.service"

@Module({
  imports: [TypeOrmModule.forFeature([Item, Category, Unit, Warehouse, Location, StockLevel, StockTransaction])],
  controllers: [ItemsController, CategoriesController, UnitsController, WarehousesController, StockController],
  providers: [ItemsService, CategoriesService, UnitsService, WarehousesService, StockService],
  exports: [ItemsService, StockService],
})
export class InventoryModule {}
