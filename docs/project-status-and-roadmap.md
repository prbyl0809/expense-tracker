# Expense Tracker Project Status And Roadmap

Last updated: 2026-04-06

## 1. Project Goal

The goal of the project is to build a modern fullstack expense tracker application with:

- Spring Boot backend
- PostgreSQL database
- JWT-based authentication
- multi-user data isolation
- a React frontend

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
- configurable CORS for frontend origins
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
- update category
- delete category

Status:

- category data is now bound to the logged-in user
- request payload no longer requires `userId`
- delete is blocked when transactions still reference the category

#### Transactions

Implemented:

- create transaction
- list transactions
- filter transactions
- get transaction by id
- update transaction
- delete transaction
- pagination for list and filter endpoints
- sorting for list and filter endpoints

Status:

- all transaction operations are scoped to the current authenticated user
- cross-user access is blocked
- request payload no longer requires `userId`
- filters are applied inside the authenticated user boundary
- paginated responses now have a stable DTO shape

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

### Milestone E: Frontend Foundation

Completed:

- Vite + React + TypeScript frontend scaffold under `frontend/`
- MUI-based theme system with light/dark mode support
- protected route model with JWT-backed auth bootstrap
- dashboard, transactions, categories, settings, login, and register page shells
- authenticated API client and React Query foundation

Why this matters:

- the backend is now consumable through a real UI shell
- the next frontend iterations can focus on user flows instead of project setup
- theme, routing, and auth decisions are no longer open questions

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
- CORS preflight
- category ownership
- transaction ownership and cross-user protection
- transaction pagination and sorting
- dashboard summary aggregation

## 5. Known Gaps

These are the main gaps that still separate the project from a stronger production baseline.

### 5.1 API Completeness Gap

Current gap:

- response DTO cleanup is not decided yet
- transaction create/edit UX is not implemented in the frontend yet
- dashboard widgets can still be expanded and refined

Impact:

- frontend integration will need these soon
- list endpoints can become inefficient as data grows

### 5.2 Security Hardening Gap

Current gap:

- there is no refresh token flow
- no role model exists yet

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

- standardize API error responses if needed
- review response DTOs and decide whether `userId` should remain in responses

Expected outcome:

- frontend can consume a more complete and scalable API
- category management becomes functionally complete

Acceptance criteria:

- category CRUD is complete
- large transaction lists do not require full-table style responses

Current status:

- in progress

## Phase 3: Complete Core Frontend Flows

Priority: high

Expected outcome:

- the frontend becomes functionally usable, not only navigable
- a user can complete the main finance workflow from the UI

Acceptance criteria:

- a user can register, log in, create categories, create transactions, edit transactions, delete transactions, and view the dashboard from the UI

Current status:

- in progress
- scaffold, auth shell, dashboard, category management, and transaction listing are implemented
- next target should be transaction create/edit/delete UX

## Phase 4: CI Foundation

Priority: high

Tasks:

- add GitHub Actions workflow for backend tests
- add GitHub Actions workflow for frontend build
- enable dependency caching for Maven and npm
- run workflows on push and pull request

Expected outcome:

- broken backend or frontend changes are blocked before merge
- the repo becomes safer for iterative development

Acceptance criteria:

- backend workflow runs `mvn test`
- frontend workflow runs `npm ci` and `npm run build`
- pull requests show clear status checks

## Phase 5: Containerization And Deployment Baseline

Priority: medium

Tasks:

- add backend `Dockerfile`
- decide whether frontend should also be containerized
- extend compose setup if full-stack startup is desired
- document runtime environment variables

Expected outcome:

- the app becomes easier to run consistently across environments
- deployment preparation becomes simpler

Acceptance criteria:

- backend can run from a container with externalized configuration
- frontend container exists only if there is a real deployment or startup need for it

## Phase 6: Product Features

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

## Phase 7: Production Hardening

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
6. Implement transaction create/edit/delete flows in the frontend.
7. Add GitHub Actions for backend tests and frontend build.
8. Add backend containerization and decide whether frontend containerization is justified.
9. Refine dashboard widgets and response cleanup details needed by the frontend.

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

The backend is now stable enough to support UI work, and the frontend scaffold is in place. The next valuable move is to finish the main frontend transaction flow, then add CI, then containerize the runtime where it adds real value.
