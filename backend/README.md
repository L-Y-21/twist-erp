# TWIST ERP Backend API

Complete Construction Company Management System built with NestJS and PostgreSQL.

## Features

- JWT Authentication with Refresh Tokens
- Role-Based Access Control (RBAC)
- Permission-Based Authorization
- Audit Logging
- Real-time Updates with WebSockets
- Background Job Processing
- Redis Caching
- API Documentation with Swagger
- Docker Support

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start database with Docker
docker-compose up -d postgres redis

# Run migrations
npm run migration:run

# Seed database
npm run seed

# Start development server
npm run start:dev
```

### Access Points

- API: http://localhost:4000
- Swagger Docs: http://localhost:4000/api/docs

## Project Structure

```
src/
├── common/           # Shared modules, decorators, guards
├── config/           # Configuration files
├── modules/          # Business modules
│   ├── auth/         # Authentication & authorization
│   ├── users/        # User management
│   ├── roles/        # Role & permission management
│   ├── companies/    # Company & branch management
│   ├── inventory/    # Inventory management
│   ├── procurement/  # Procurement module
│   ├── sales/        # Sales & CRM
│   ├── projects/     # Project management
│   ├── fleet/        # Fleet management
│   ├── hr/           # HR management
│   └── finance/      # Finance & accounting
└── database/         # Migrations and seeds
```

## Available Scripts

- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run migration:generate` - Generate migration
- `npm run migration:run` - Run migrations
- `npm run seed` - Seed database

## API Documentation

Full API documentation is available at `/api/docs` when the server is running.

## License

MIT
