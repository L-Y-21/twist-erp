import { Controller, Get, Post, Patch, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { CustomersService } from "./customers.service"
import type { CreateCustomerDto } from "./dto/create-customer.dto"
import type { UpdateCustomerDto } from "./dto/update-customer.dto"

@ApiTags("Customers")
@ApiBearerAuth()
@Controller("sales/customers")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Permissions("customers:read")
  @ApiOperation({ summary: "Get all customers" })
  findAll() {
    return this.customersService.findAll()
  }

  @Get(":id")
  @Permissions("customers:read")
  @ApiOperation({ summary: "Get customer by ID" })
  findOne(id: string) {
    return this.customersService.findOne(id)
  }

  @Post()
  @Permissions("customers:create")
  @ApiOperation({ summary: "Create customer" })
  create(createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto)
  }

  @Patch(":id")
  @Permissions("customers:update")
  @ApiOperation({ summary: "Update customer" })
  update(id: string, updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto)
  }

  @Delete(":id")
  @Permissions("customers:delete")
  @ApiOperation({ summary: "Delete customer" })
  remove(id: string) {
    return this.customersService.remove(id)
  }
}
