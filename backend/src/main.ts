import { NestFactory } from "@nestjs/core"
import { ValidationPipe, VersioningType } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"
import helmet from "helmet"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"],
  })

  // Security
  app.use(helmet())
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
  app.use(cookieParser())

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("TWIST ERP API")
    .setDescription("Complete Construction Company Management System API")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("Authentication")
    .addTag("Users")
    .addTag("Roles")
    .addTag("Companies")
    .addTag("Inventory")
    .addTag("Procurement")
    .addTag("Sales")
    .addTag("Projects")
    .addTag("Fleet")
    .addTag("HR")
    .addTag("Finance")
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  const port = process.env.PORT || 4000
  await app.listen(port)
  console.log(`🚀 TWIST ERP API is running on: http://localhost:${port}`)
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`)
}

bootstrap()
