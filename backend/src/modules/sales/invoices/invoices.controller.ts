import { Controller, Get, Post, Param, Body, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { InvoicesService } from "./invoices.service"
import type { CreateInvoiceDto } from "./dto/create-invoice.dto"

@ApiTags("Invoices")
@ApiBearerAuth()
@Controller("sales/invoices")
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll() {
    return this.invoicesService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.invoicesService.findOne(id)
  }

  @Post()
  create(@Body() data: CreateInvoiceDto, @Request() req) {
    return this.invoicesService.create(data, req.user.id)
  }
}
