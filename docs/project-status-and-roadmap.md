# Expense Tracker Project Status And Roadmap

Last updated: 2026-04-05

## 1. Project Goal

The goal of the project is to build a modern fullstack expense tracker application with:

- Spring Boot backend
- PostgreSQL database
- JWT-based authentication
- multi-user data isolation
- later a React frontend

The target is not a demo-only API. The backend is already moving toward a production-style model where business data is always scoped to the authenticated user.

## 2. Current Backend Status

### 2.1 Infrastructure And Core Setup

Implemented:

- Spring Boot project setup with Maven
- PostgreSQL integration via Docker Compose
- Flyway database migration setup
- initial schema in `V1__init.sql`
- health endpoints
- OpenAPI / Swagger UI integration

Current state:

- the application starts against PostgreSQL successfully
- schema validation is enabled with JPA `ddl-auto=validate`
- Flyway migrations run automatically on startup

### 2.2 Domain Model

Implemented entities:

- `AppUser`
- `Category`
- `FinancialTransaction`

Current relationships:

- one user has many categories
- one user has many transactions
- one transaction belongs to one category

### 2.3 Authentication And Security

Implemented:

- user registration
- user login
- BCrypt password hashing
- JWT generation
- JWT validation
- stateless Spring Security configuration
- custom JWT filter
- current authenticated user lookup through `AuthenticatedUserService`
- `/api/users/me` endpoint for current user inspection
- JWT secret loaded from environment configuration
- seed endpoint disabled by default unless explicitly enabled

Public endpoints:

- `/api/auth/**`
- `/api/health`
- `/actuator/health`
- Swagger/OpenAPI endpoints

Protected endpoints:

- all category endpoints
- all transaction endpoints
- all dashboard endpoints
- `/api/users/me`
- `/api/test/seed`

### 2.4 Business Modules

#### Categories

Implemented:

- create category
- list categories for current authenticated user

Status:

- category data is now bound to the logged-in user
- request payload no longer requires `userId`

#### Transactions

Implemented:

- create transaction
- list transactions
- filter transactions
- get transaction by id
- update transaction
- delete transaction

Status:

- all transaction operations are scoped to the current authenticated user
- cross-user access is blocked
- request payload no longer requires `userId`
- filters are applied inside the authenticated user boundary

#### Dashboard

Implemented:

- date-range summary
- current-month summary
- total income
- total expense
- balance
- transaction count
- category summary aggregation

Status:

- dashboard queries now use the authenticated user instead of `userId` request parameters

## 3. Major Milestones Already Completed

### Milestone A: Backend Foundation

Completed:

- Spring Boot setup
- PostgreSQL + Docker setup
- Flyway schema migration

### Milestone B: Core Financial Data

Completed:

- category module
- transaction module
- dashboard aggregation module

### Milestone C: Multi-User Authentication

Completed:

- registration
- login
- JWT auth
- stateless security
- authenticated current user support

### Milestone D: Critical Ownership Refactor

Completed:

- removal of `userId` from category create/list inputs
- removal of `userId` from transaction create/list/filter/update inputs
- removal of `userId` from dashboard query inputs
- repository queries moved from `ft.user.id = :userId` to authenticated-user-based access
- ownership enforcement for transaction read/update/delete

Why this matters:

- the API is no longer trusting client-supplied ownership
- business endpoints now follow the authenticated session boundary
- this is the main step that moves the backend toward production-style behavior

## 4. Verified Working Behavior

Manual API verification was run on 2026-04-05 against a live local application.

Verified successfully:

- register
- login
- access control without token
- current user endpoint
- category create/list without `userId`
- transaction create/list/filter/get/update/delete without `userId`
- dashboard summary and current-month summary without `userId`
- cross-user data isolation
- cross-user category usage blocked
- cross-user transaction lookup blocked

Observed result:

- 26 out of 26 live API checks passed

Automated backend verification is also in place.

Covered by integration tests:

- auth register/login
- unauthorized access handling
- category ownership
- transaction ownership and cross-user protection
- dashboard summary aggregation

## 5. Known Gaps

These are the main gaps that still separate the project from a stronger production baseline.

### 5.1 API Completeness Gap

Current gap:

- category update/delete endpoints are missing
- category CRUD is not complete yet
- transaction pagination and sorting are not implemented

Impact:

- frontend integration will need these soon
- list endpoints can become inefficient as data grows

### 5.2 Security Hardening Gap

Current gap:

- there is no refresh token flow
- no role model exists yet
- no CORS strategy is documented for frontend integration

Impact:

- acceptable for local development
- not acceptable as-is for real deployment

### 5.3 Operational Gap

Current gap:

- no environment profile strategy beyond local defaults
- no deployment notes
- no containerized backend app runtime
- no CI pipeline

Impact:

- local development works
- team scaling and release reliability are still weak

## 6. Recommended Next Steps

The next steps should be executed in this order.

## Phase 1: Stabilize The Backend

Priority: critical

Tasks:

- add automated integration tests for auth flows
- add integration tests for category ownership
- add integration tests for transaction ownership and filtering
- add integration tests for dashboard summaries
- add negative tests for unauthorized and cross-user access
- move JWT secret to environment configuration
- restrict or profile-gate `/api/test/seed`

Expected outcome:

- future backend changes become safer
- the ownership refactor is protected by tests
- local and production config boundaries become clearer

Acceptance criteria:

- `mvn test` covers the main auth and ownership scenarios
- no business endpoint relies on client-provided ownership
- local secrets are no longer hardcoded

Current status:

- completed

## Phase 2: Complete The Backend API Surface

Priority: high

Tasks:

- implement category update endpoint
- implement category delete endpoint
- add pagination for transaction list and filter endpoints
- add sorting options for transaction queries
- standardize API error responses if needed
- review response DTOs and decide whether `userId` should remain in responses

Expected outcome:

- frontend can consume a more complete and scalable API
- category management becomes functionally complete

Acceptance criteria:

- category CRUD is complete
- large transaction lists do not require full-table style responses

## Phase 3: Start The Frontend

Priority: high

Suggested stack:

- React
- Vite
- MUI
- React Query

Recommended first frontend slices:

- app shell and routing
- auth pages: register and login
- token storage and authenticated API client
- dashboard page
- category selector
- transaction list page
- add transaction form

Expected outcome:

- the backend becomes visible as a usable product
- the most important user flows can be exercised end-to-end

Acceptance criteria:

- a user can register, log in, create categories, create transactions, and view the dashboard from the UI

## Phase 4: Product Features

Priority: medium

Candidate features:

- budget tracking
- recurring transactions
- richer dashboard widgets
- monthly trends
- category-level analytics
- data export

Expected outcome:

- the application becomes useful beyond basic bookkeeping

## Phase 5: Production Hardening

Priority: medium

Tasks:

- introduce environment-specific configuration
- add CORS configuration for the frontend host
- define logging and audit expectations
- add CI checks for build and tests
- prepare deployment configuration
- consider refresh tokens and token expiration strategy

Expected outcome:

- the project becomes deployable with fewer operational risks

## 7. Immediate Execution Plan

If the goal is steady progress with minimal rework, the recommended implementation order is:

1. Add backend integration tests for auth and ownership.
2. Move sensitive JWT configuration to environment variables.
3. Implement category update/delete.
4. Add pagination and sorting to transaction endpoints.
5. Scaffold the React frontend and wire login/register.
6. Build dashboard and transaction management screens.

## 8. Decision Notes

### Keep

- current authenticated user model
- stateless JWT approach
- Flyway-managed schema
- Docker-based local PostgreSQL

### Revisit Later

- whether response DTOs should expose `userId`
- whether the seed endpoint should exist outside local/dev profile
- whether refresh tokens are needed immediately or later
- whether roles/admin capabilities are needed

## 9. Summary

The backend has already passed the most important architectural threshold:

- authentication works
- multi-user isolation works
- business endpoints no longer trust client-supplied `userId`

The most valuable next move is not adding random new features. The most valuable next move is stabilizing the current backend with automated tests, then building the frontend on top of that safer foundation.
