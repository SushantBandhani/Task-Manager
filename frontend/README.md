# Taskr — Task Management Frontend

A polished Next.js 14 + TypeScript frontend for your task management API.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** — fully typed throughout
- **Tailwind CSS** — custom dark design system
- **Axios** — with auto refresh-token interceptor
- **react-hot-toast** — toast notifications
- **date-fns** — date formatting

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API URL

Edit `.env.local` to point to your backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
task-manager/
├── app/
│   ├── layout.tsx            # Root layout — AuthProvider + Toaster
│   ├── page.tsx              # Root redirect (→ dashboard or login)
│   ├── globals.css           # Design system, CSS variables, fonts
│   ├── login/page.tsx        # Login page
│   ├── register/page.tsx     # Registration page
│   └── dashboard/
│       ├── layout.tsx        # Auth guard
│       └── page.tsx          # Main task dashboard
├── components/
│   ├── Navbar.tsx            # Top navigation
│   ├── StatsBar.tsx          # Task counters + progress bar
│   ├── FilterBar.tsx         # Search + status filter + view toggle
│   ├── TaskCard.tsx          # Grid card
│   ├── TaskList.tsx          # Table/list view
│   ├── TaskModal.tsx         # Create / Edit modal
│   ├── DeleteDialog.tsx      # Delete confirmation
│   ├── TaskSkeleton.tsx      # Loading skeleton
│   ├── EmptyState.tsx        # Empty state
│   └── StatusBadge.tsx       # Coloured status pill
├── context/
│   └── AuthContext.tsx       # Auth state + login/logout/register
├── lib/
│   ├── api.ts                # Axios instance + refresh interceptor
│   ├── authApi.ts            # /auth/* endpoints
│   └── tasksApi.ts           # /tasks/* endpoints
└── types/
    └── index.ts              # TypeScript interfaces
```

---

## Auth Flow

- **HttpOnly cookies** — tokens are sent automatically by the browser on every request (`withCredentials: true`)
- **Refresh interceptor** — on any `401`, the Axios interceptor silently calls `POST /auth/refresh`. If it succeeds, it replays the original request. If it fails, it redirects to `/login`
- **Auth guard** — the dashboard layout checks auth state and redirects unauthenticated users

---

## API Endpoints Expected

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login, sets cookies |
| POST | `/auth/logout` | Clear cookies |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current user |
| GET | `/tasks` | List tasks (optional `?status=&search=`) |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

---

## Features

- ✅ Login & Register with client-side validation
- ✅ Persistent auth via HttpOnly cookies + silent token refresh
- ✅ Task dashboard with grid and list views
- ✅ Real-time search (client-side) + status filter tabs
- ✅ Stats bar with completion progress
- ✅ Create / Edit tasks in a slide-up modal
- ✅ Delete with confirmation dialog
- ✅ Toggle task status (pending → in_progress → completed) with optimistic UI
- ✅ Overdue & due-today indicators
- ✅ Toast notifications for all operations
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Animated skeleton loaders
- ✅ Empty states for no tasks / no results
