import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Customer } from "./customers/entities/customer.entity"
import { Lead } from "./leads/entities/lead.entity"
import { Quotation } from "./quotations/entities/quotation.entity"
import { QuotationItem } from "./quotations/entities/quotation-item.entity"
import { SalesOrder } from "./sales-orders/entities/sales-order.entity"
import { SalesOrderItem } from "./sales-orders/entities/sales-order-item.entity"
import { Invoice } from "./invoices/entities/invoice.entity"
import { InvoiceItem } from "./invoices/entities/invoice-item.entity"
import { Payment } from "./payments/entities/payment.entity"
import { CustomersController } from "./customers/customers.controller"
import { LeadsController } from "./leads/leads.controller"
import { QuotationsController } from "./quotations/quotations.controller"
import { SalesOrdersController } from "./sales-orders/sales-orders.controller"
import { InvoicesController } from "./invoices/invoices.controller"
import { PaymentsController } from "./payments/payments.controller"
import { CustomersService } from "./customers/customers.service"
import { LeadsService } from "./leads/leads.service"
import { QuotationsService } from "./quotations/quotations.service"
import { SalesOrdersService } from "./sales-orders/sales-orders.service"
import { InvoicesService } from "./invoices/invoices.service"
import { PaymentsService } from "./payments/payments.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Lead,
      Quotation,
      QuotationItem,
      SalesOrder,
      SalesOrderItem,
      Invoice,
      InvoiceItem,
      Payment,
    ]),
  ],
  controllers: [
    CustomersController,
    LeadsController,
    QuotationsController,
    SalesOrdersController,
    InvoicesController,
    PaymentsController,
  ],
  providers: [CustomersService, LeadsService, QuotationsService, SalesOrdersService, InvoicesService, PaymentsService],
  exports: [CustomersService, SalesOrdersService, InvoicesService, PaymentsService],
})
export class SalesModule {}
