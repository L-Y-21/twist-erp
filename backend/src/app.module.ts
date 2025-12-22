import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ThrottlerModule } from "@nestjs/throttler"
import { BullModule } from "@nestjs/bull"
import { CacheModule } from "@nestjs/cache-manager"
import * as redisStore from "cache-manager-redis-store"

// Core Modules
import { AuthModule } from "./modules/auth/auth.module"
import { UsersModule } from "./modules/users/users.module"
import { RolesModule } from "./modules/roles/roles.module"
import { CompaniesModule } from "./modules/companies/companies.module"
import { AuditModule } from "./modules/audit/audit.module"
import { NotificationModule } from "./modules/notification/notification.module"

// Business Modules
import { InventoryModule } from "./modules/inventory/inventory.module"
import { ProcurementModule } from "./modules/procurement/procurement.module"
import { SalesModule } from "./modules/sales/sales.module"
import { ProjectsModule } from "./modules/projects/projects.module"
import { FleetModule } from "./modules/fleet/fleet.module"
import { HrModule } from "./modules/hr/hr.module"
import { FinanceModule } from "./modules/finance/finance.module"
import { DashboardModule } from "./modules/dashboard/dashboard.module"

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Database
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: Number.parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "admin123",
      database: process.env.DB_DATABASE || "TWIST_ERP",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: process.env.NODE_ENV === "development",
      logging: process.env.NODE_ENV === "development",
      ssl: process.env.DB_SSL === "true",
    }),

    // Redis Cache
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || "localhost",
      port: Number.parseInt(process.env.REDIS_PORT) || 6379,
      ttl: 300,
    }),

    // Bull Queue
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number.parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Core Modules
    AuthModule,
    UsersModule,
    RolesModule,
    CompaniesModule,
    AuditModule,
    NotificationModule,

    // Business Modules
    InventoryModule,
    ProcurementModule,
    SalesModule,
    ProjectsModule,
    FleetModule,
    HrModule,
    FinanceModule,
    DashboardModule,
  ],
})
export class AppModule {}
