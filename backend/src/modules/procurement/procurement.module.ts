import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Vendor } from "./vendors/entities/vendor.entity"
import { PurchaseRequisition } from "./purchase-requisitions/entities/purchase-requisition.entity"
import { PurchaseRequisitionItem } from "./purchase-requisitions/entities/purchase-requisition-item.entity"
import { PurchaseOrder } from "./purchase-orders/entities/purchase-order.entity"
import { PurchaseOrderItem } from "./purchase-orders/entities/purchase-order-item.entity"
import { GoodsReceivedNote } from "./grn/entities/goods-received-note.entity"
import { GoodsReceivedNoteItem } from "./grn/entities/goods-received-note-item.entity"
import { VendorsController } from "./vendors/vendors.controller"
import { PurchaseOrdersController } from "./purchase-orders/purchase-orders.controller"
import { GRNController } from "./grn/grn.controller"
import { VendorsService } from "./vendors/vendors.service"
import { PurchaseOrdersService } from "./purchase-orders/purchase-orders.service"
import { GRNService } from "./grn/grn.service"
import { InventoryModule } from "../inventory/inventory.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vendor,
      PurchaseRequisition,
      PurchaseRequisitionItem,
      PurchaseOrder,
      PurchaseOrderItem,
      GoodsReceivedNote,
      GoodsReceivedNoteItem,
    ]),
    InventoryModule,
  ],
  controllers: [VendorsController, PurchaseOrdersController, GRNController],
  providers: [VendorsService, PurchaseOrdersService, GRNService],
  exports: [VendorsService, PurchaseOrdersService, GRNService],
})
export class ProcurementModule {}
