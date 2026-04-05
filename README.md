# Expense Tracker

Spring Boot REST API for tracking income and expenses with JWT authentication, PostgreSQL persistence, and per-user data isolation.

Detailed project status and next-step planning lives in [docs/project-status-and-roadmap.md](docs/project-status-and-roadmap.md).

## Stack

- Java 21
- Spring Boot 4.0.5
- Spring MVC
- Spring Data JPA
- PostgreSQL
- Flyway
- Spring Security
- JJWT
- Springdoc OpenAPI
- Maven
- Docker Compose

## Current Features

- user registration and login
- BCrypt password hashing
- JWT generation and validation
- stateless Spring Security setup
- current authenticated user endpoint
- category create and list
- transaction create, list, filter, get by id, update, and delete
- dashboard summary by date range
- dashboard summary for current month
- Flyway database migrations on startup
- local seed endpoint for sample data
- health and Swagger endpoints

## Current API Model

Business endpoints no longer accept client-supplied `userId` for ownership.

The backend uses the authenticated user from the JWT token for:

- category ownership
- transaction ownership
- dashboard queries

This is the current intended API design:

- `GET /api/categories`
- `POST /api/categories`
- `GET /api/transactions`
- `GET /api/transactions/filter`
- `POST /api/transactions`
- `PUT /api/transactions/{transactionId}`
- `DELETE /api/transactions/{transactionId}`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/summary/current-month`

## Project Structure

```text
src/main/java/com/projects/expensetracker
|- auth
|- category
|- common
|- dashboard
|- exception
|- security
|- transaction
\- user
```

## Prerequisites

- Java 21
- Maven 3.9+
- Docker and Docker Compose

## Configuration

The application reads its database settings from environment variables.
`application.yml` also imports a local `.env` file if present.

`.env.example`

```env
POSTGRES_DB=expensetracker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-base64-secret
JWT_EXPIRATION_MS=86400000
APP_SEED_ENABLED=false
```

The JDBC URL pattern is:

```text
jdbc:postgresql://localhost:${DB_PORT:5433}/${POSTGRES_DB:expensetracker}
```

With the provided `.env.example`, PostgreSQL is available on `localhost:5432`.

## Running Locally

1. Copy `.env.example` to `.env` and adjust values if needed.
2. Start PostgreSQL:

```bash
docker compose up -d
```

3. Start the API:

```bash
mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

Flyway migrations run automatically during startup.

Default frontend dev CORS origin:

- `http://localhost:5173`

## Authentication Flow

### Register

`POST /api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "displayName": "Demo User"
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Both endpoints return a JWT token. Use it on protected endpoints:

```text
Authorization: Bearer <token>
```

## Main Endpoints

### Public

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`
- `GET /actuator/health`
- `GET /v3/api-docs`
- `GET /swagger-ui/index.html`

### Protected

- `GET /api/users/me`
- `POST /api/categories`
- `GET /api/categories`
- `PUT /api/categories/{categoryId}`
- `DELETE /api/categories/{categoryId}`
- `POST /api/transactions`
- `GET /api/transactions`
- `GET /api/transactions/filter?fromDate=2026-04-01&toDate=2026-04-30&type=EXPENSE&categoryId=2&page=0&size=20`
- `GET /api/transactions/{transactionId}`
- `PUT /api/transactions/{transactionId}`
- `DELETE /api/transactions/{transactionId}`
- `GET /api/dashboard/summary?fromDate=2026-04-01&toDate=2026-04-30`
- `GET /api/dashboard/summary/current-month`
- `POST /api/test/seed`

### Category Payload

```json
{
  "name": "Groceries",
  "type": "EXPENSE"
}
```

### Transaction Create/Update Payload

```json
{
  "amount": 24.99,
  "type": "EXPENSE",
  "description": "Lunch",
  "date": "2026-04-05",
  "categoryId": 2
}
```

### Dashboard

The dashboard summary returns:

- total income
- total expense
- balance
- transaction count
- per-category aggregates

### Paginated Transaction Response

`GET /api/transactions` and `GET /api/transactions/filter` return:

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0,
  "first": true,
  "last": true
}
```

Supported transaction sort fields:

- `date`
- `id`
- `amount`
- `type`
- `description`
- `createdAt`

Example:

```text
GET /api/transactions?page=0&size=10&sort=amount,desc
```

## API Docs And Health

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI spec: `http://localhost:8080/v3/api-docs`
- App health: `http://localhost:8080/api/health`
- Spring Boot actuator health: `http://localhost:8080/actuator/health`

## Seed Test Data

For local development, an authenticated user can seed sample data only if `APP_SEED_ENABLED=true` is set:

```bash
curl -X POST http://localhost:8080/api/test/seed \
  -H "Authorization: Bearer <token>"
```

This creates:

- user `test@example.com`
- category `Salary`
- category `Food`
- one income transaction for the current date

The response includes generated IDs.

## Database

Flyway initializes three main tables:

- `app_user`
- `category`
- `financial_transaction`

Relationships:

- a user owns many categories
- a user owns many transactions
- a transaction belongs to one category

## Security

Current security behavior:

- JWT-based stateless authentication
- business endpoints require authentication
- public auth and health endpoints stay open
- CSRF is disabled for the stateless API
- CORS is enabled for configured frontend origins
- JWT filter populates the Spring Security context
- JWT secret is read from environment configuration
- seed endpoint is disabled by default unless explicitly enabled

## Verification Status

On 2026-04-05, the live local API was manually smoke-tested successfully for:

- auth register/login
- protected route access control
- category creation and listing
- transaction CRUD and filtering
- dashboard summaries
- cross-user ownership isolation

Automated integration tests also cover:

- auth register/login
- unauthorized access
- CORS preflight for the frontend dev origin
- category ownership
- transaction ownership and cross-user blocking
- transaction pagination and sorting
- dashboard aggregation and current-month summary

## Development Notes

- JPA schema generation is set to `validate`, so the database schema must match the Flyway migrations.
- The test suite runs against H2 in PostgreSQL compatibility mode with Flyway migrations enabled.
- The backend API now includes category CRUD and paginated transaction list/filter endpoints.
- The next major work items are response contract cleanup decisions and frontend implementation.
