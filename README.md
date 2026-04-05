# Taskr — Task Management System

A full-stack task management application built as part of a Software Engineering Assessment. Users can register, log in, and perform complete management of their personal tasks — all secured with JWT authentication and built on a modern TypeScript stack.

---

## 🚀 Quick Start

> **Prerequisites:** Docker and Docker Compose must be installed on your machine.

```bash
docker compose up
```

The application will be available at:

| Service | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| Backend API (Node.js) | http://localhost:8000/api |
| PostgreSQL Database | http://localhost:5432 |
| PgAdmin | http://localhost:5050 |

To stop the application:

```bash
docker compose down
```

To rebuild after code changes:

```bash
docker compose up --build
```

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Environment Variables](#environment-variables)
- [Running Locally Without Docker](#running-locally-without-docker)
- [Wireframes](#wireframes)

---

## Overview

Taskr is a personal productivity tool that allows individual users to manage their daily tasks. Each user has a private workspace — they only ever see their own tasks. The system enforces authentication on all task endpoints and uses short-lived access tokens combined with long-lived refresh tokens to keep users securely logged in without requiring frequent re-authentication.

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js v5 |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (Access + Refresh Tokens) |
| Password Hashing | bcrypt |
| Validation | Zod |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| HTTP Client | Axios (with interceptors) |
| Notifications | react-hot-toast |
| Date Formatting | date-fns |

---

## Project Structure

```
taskr/
├── backend/                        # Node.js + Express API
│   ├── prisma/
│   │   └── schema.prisma           # Database schema (User, Task, AuthToken)
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.config.ts        # PostgreSQL connection
│   │   │   └── prisma.ts           # Prisma client singleton
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts  # Register, Login, Logout, Refresh, Me
│   │   │   └── tasks.controller.ts # Full CRUD + Toggle + Pagination
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts  # JWT verification middleware
│   │   ├── routes/
│   │   │   ├── auth.router.ts
│   │   │   └── tasks.router.ts
│   │   ├── services/
│   │   │   └── auth.service.ts     # Token generation
│   │   └── utils/
│   │       ├── ApiError.ts
│   │       ├── ApiResponse.ts
│   │       └── asyncHandler.ts
│   └── Dockerfile
│
├── frontend/                       # Next.js web application
│   ├── app/
│   │   ├── layout.tsx              # Root layout — AuthProvider + Toaster
│   │   ├── page.tsx                # Root redirect
│   │   ├── login/page.tsx          # Login page
│   │   ├── register/page.tsx       # Registration page
│   │   └── dashboard/
│   │       ├── layout.tsx          # Auth guard
│   │       └── page.tsx            # Main task dashboard
│   ├── components/
│   │   ├── Navbar.tsx              # Top navigation + logout
│   │   ├── StatsBar.tsx            # Task counters + completion bar
│   │   ├── FilterBar.tsx           # Search + status filter + view toggle
│   │   ├── TaskCard.tsx            # Grid card view
│   │   ├── TaskList.tsx            # Table/list view
│   │   ├── TaskModal.tsx           # Create / Edit modal
│   │   ├── DeleteDialog.tsx        # Delete confirmation dialog
│   │   ├── Pagination.tsx          # Page navigation
│   │   ├── TaskSkeleton.tsx        # Loading skeleton
│   │   ├── EmptyState.tsx          # Empty state illustrations
│   │   └── StatusBadge.tsx         # Coloured status pill
│   ├── context/
│   │   └── AuthContext.tsx         # Global auth state
│   ├── lib/
│   │   ├── api.ts                  # Axios instance + refresh interceptor
│   │   ├── authApi.ts              # Auth API calls
│   │   └── tasksApi.ts             # Task API calls
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## Features

### Authentication
- **Register** — create an account with first name, last name, email and password
- **Login** — authenticate and receive JWT tokens via HttpOnly cookies
- **Logout** — invalidates the refresh token server-side and clears cookies
- **Silent token refresh** — when the access token expires, the Axios interceptor automatically calls `POST /auth/refreshToken`, rotates both tokens, and replays the original failed request — the user never notices
- **Auth guard** — the dashboard layout redirects unauthenticated users to `/login`

### Task Management
- **Create** tasks with a title, description, status, and optional due date
- **View** tasks in a responsive grid or list layout
- **Edit** any task field via a slide-up modal
- **Delete** tasks with a confirmation dialog
- **Toggle** task status — cycles through `pending → in_progress → completed → pending`
- **Pagination** — tasks load in pages of 10; navigate forward and backward
- **Filter** by status: All / Pending / In Progress / Done
- **Search** tasks by title (case-insensitive, server-side)
- **Stats bar** — live count of tasks per status + completion percentage
- **Overdue indicators** — tasks past their due date are highlighted
- **Toast notifications** — success and error feedback for every operation

### UI / UX
- Fully responsive — works on mobile, tablet, and desktop
- Dark theme with a warm amber accent design system
- Animated skeleton loaders during data fetching
- Empty state screens for zero tasks and zero search results
- Optimistic UI for status toggling — instant feedback, reverts on error

---

## API Reference

All endpoints are prefixed with `/api`.

### Auth Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Create a new user account |
| `POST` | `/auth/login` | No | Log in and receive tokens as cookies |
| `POST` | `/auth/refreshToken` | No (cookie) | Rotate access + refresh tokens |
| `POST` | `/auth/logout` | Yes | Invalidate refresh token and clear cookies |
| `GET` | `/auth/user` | Yes | Get current authenticated user |

### Task Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/tasks` | Yes | List tasks (paginated, filterable, searchable) |
| `POST` | `/tasks` | Yes | Create a new task |
| `GET` | `/tasks/:id` | Yes | Get a single task by ID |
| `PUT` | `/tasks/:id` | Yes | Update a task |
| `DELETE` | `/tasks/:id` | Yes | Delete a task |
| `PATCH` | `/tasks/:id/toggle` | Yes | Cycle the task's status |

### `GET /tasks` Query Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page (max 100) |
| `status` | string | — | Filter: `pending`, `in_progress`, `completed` |
| `search` | string | — | Search by title (case-insensitive) |
| `sort` | string | `created_at` | Sort field: `created_at`, `updated_at`, `due_date`, `title` |
| `order` | string | `desc` | Sort direction: `asc`, `desc` |

### Standard Response Envelope

All responses follow this shape:

```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "message": "Tasks fetched successfully"
}
```

Errors:

```json
{
  "success": false,
  "statusCode": 404,
  "errorMessage": "Task not found"
}
```

---

## Authentication Flow

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Browser   │         │   Next.js   │         │   Node API   │
└──────┬──────┘         └──────┬──────┘         └──────┬───────┘
       │                       │                        │
       │  1. POST /auth/login  │                        │
       │──────────────────────────────────────────────>│
       │                       │                        │
       │  2. Set-Cookie: accessToken + refreshToken     │
       │<──────────────────────────────────────────────│
       │                       │                        │
       │  3. GET /tasks (with accessToken cookie)       │
       │──────────────────────────────────────────────>│
       │                       │                        │
       │       [Access token expires — 401]             │
       │<──────────────────────────────────────────────│
       │                       │                        │
       │  4. Axios interceptor catches 401              │
       │     POST /auth/refresh (with refreshToken)     │
       │──────────────────────────────────────────────>│
       │                       │                        │
       │  5. New tokens set in cookies                  │
       │<──────────────────────────────────────────────│
       │                       │                        │
       │  6. Original request replayed automatically    │
       │──────────────────────────────────────────────>│
       │                       │                        │
       │  7. 200 OK — user never noticed the refresh    │
       │<──────────────────────────────────────────────│
```

Token lifetimes:
- **Access Token** — 15 min
- **Refresh Token** — 24 hours

Both tokens are stored in `HttpOnly` cookies — they are never accessible via JavaScript, protecting against XSS attacks.

---

## Environment Variables

### Backend — `backend/.env`

```env
# Database
DATABASE_URL="postgresql://postgres:password@db:5432/taskr"
ALLOWED_ORIGINS='http://localhost:3000'

# Server
PORT=8000
ENVIRONMENT=development        # or production

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=1d
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Running Locally Without Docker

If you prefer to run the services individually:

### 1. Database

Make sure PostgreSQL is running locally and create a database:

```sql
CREATE DATABASE taskr;
```

### 2. Backend

```bash
cd backend
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run dev
```

Runs on `http://localhost:8000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`

