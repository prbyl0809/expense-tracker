# Expense Tracker

Spring Boot REST API for tracking income and expenses by user, category, and date range. The project uses PostgreSQL for persistence, Flyway for schema migrations, and OpenAPI/Swagger UI for API exploration.

## Stack

- Java 21
- Spring Boot 4
- Spring MVC
- Spring Data JPA
- PostgreSQL
- Flyway
- Spring Security
- Springdoc OpenAPI
- Maven
- Docker Compose

## Features

- Create and list categories for a user
- Create, list, filter, update, and delete financial transactions
- Generate dashboard summaries for an arbitrary date range or the current month
- Apply database migrations automatically on startup
- Seed local test data with a dedicated endpoint
- Expose health endpoints for local checks

## Project Structure

```text
src/main/java/com/projects/expensetracker
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

`.env.example`

```env
POSTGRES_DB=expensetracker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_PORT=5432
```

The application connects with:

```text
jdbc:postgresql://localhost:${DB_PORT:5433}/${POSTGRES_DB:expensetracker}
```

If you use the provided `.env.example`, PostgreSQL will be available on `localhost:5432`.

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

## API Docs And Health

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI spec: `http://localhost:8080/v3/api-docs`
- App health: `http://localhost:8080/api/health`
- Spring Boot actuator health: `http://localhost:8080/actuator/health`

## Seed Test Data

For local development, seed a sample user, two categories, and one transaction:

```bash
curl -X POST http://localhost:8080/api/test/seed
```

This creates:

- User: `test@example.com`
- Categories: `Salary` and `Food`
- One income transaction for the current date

The response includes generated IDs you can reuse in later requests.

## Main Endpoints

### Categories

- `POST /api/categories`
- `GET /api/categories?userId={userId}`

Example request:

```json
{
  "name": "Groceries",
  "type": "EXPENSE",
  "userId": 1
}
```

### Transactions

- `POST /api/transactions`
- `GET /api/transactions?userId={userId}`
- `GET /api/transactions/filter?userId={userId}&fromDate=2026-04-01&toDate=2026-04-30&type=EXPENSE&categoryId=2`
- `GET /api/transactions/{transactionId}`
- `PUT /api/transactions/{transactionId}`
- `DELETE /api/transactions/{transactionId}`

Example create/update payload:

```json
{
  "amount": 24.99,
  "type": "EXPENSE",
  "description": "Lunch",
  "date": "2026-04-05",
  "userId": 1,
  "categoryId": 2
}
```

### Dashboard

- `GET /api/dashboard/summary?userId={userId}&fromDate=2026-04-01&toDate=2026-04-30`
- `GET /api/dashboard/summary/current-month?userId={userId}`

The dashboard summary returns total income, total expense, balance, transaction count, and per-category aggregates.

## Database

Flyway initializes three tables:

- `app_user`
- `category`
- `financial_transaction`

Relationships:

- A user owns many categories
- A user owns many transactions
- A transaction belongs to one category

## Security

Spring Security is present, but the current configuration permits all requests and disables CSRF. HTTP Basic is configured but not required by the authorization rules yet.

## Development Notes

- JPA schema generation is set to `validate`, so the database schema must match the Flyway migrations.
- There is no user registration or login flow implemented yet.
- The API is currently modeled around explicit `userId` parameters in requests and query params.
