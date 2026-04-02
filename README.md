# Finance Data Processing and Access Control Backend

Backend implementation for a finance dashboard system using Node.js, Express, and MongoDB.

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Zod Validation

## Architecture

Layered structure for clarity and maintainability:

- Models: Mongoose schemas
- Services: Business logic and data operations
- Controllers: HTTP request-response handling
- Middlewares: Authentication, RBAC, validation, error handling
- Routes: API route definitions

## Features

- User registration and login
- Role based access control (`admin`, `analyst`, `viewer`)
- User management (admin only)
- Financial records CRUD with soft delete
- Filtering and pagination for records
- Dashboard summary APIs with MongoDB aggregation
- Input validation with clear error responses

## Assumptions

- New users registered via public register API are created as `viewer`.
- Net balance is calculated on the fly from records to avoid stale derived data.
- Soft delete is implemented for financial records using `isDeleted`.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Update `.env` values.

4. Start development server:

```bash
npm run dev
```

## API Base URL

`/api`

## Endpoints

### Auth

- `POST /api/auth/register` Public
- `POST /api/auth/login` Public

### Users (Admin only)

- `GET /api/users` List users with filters and pagination
- `POST /api/users` Create user
- `PATCH /api/users/:id/role` Update role
- `PATCH /api/users/:id/status` Update active/inactive status

### Financial Records

- `GET /api/records` Authenticated (`viewer`, `analyst`, `admin`)
- `GET /api/records/:id` Authenticated (`viewer`, `analyst`, `admin`)
- `POST /api/records` Admin only
- `PATCH /api/records/:id` Admin only
- `DELETE /api/records/:id` Admin only (soft delete)

Filter query params for `GET /api/records`:

- `page`, `limit`
- `type` (`income` or `expense`)
- `category`
- `startDate`, `endDate`
- `createdBy`

### Dashboard

- `GET /api/dashboard/stats` (`admin`, `analyst`)

Optional query params:

- `startDate`, `endDate`

Response contains:

- total income
- total expenses
- net balance
- category wise totals
- recent activity
- monthly trends

## Sample Auth Header

```http
Authorization: Bearer <JWT_TOKEN>
```

## Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "details": []
}
```

## Notes for Evaluation

This project demonstrates:

- clean route-service-controller separation
- explicit RBAC enforcement
- aggregation based dashboard metrics
- validation and consistent error handling
- maintainable modular backend structure
