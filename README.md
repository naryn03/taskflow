# TaskFlow — Mini SaaS Task Management System

A production-ready full-stack task management app with JWT authentication and multi-user support.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | SQLite + Sequelize ORM (no setup needed!) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| HTTP Client | Axios |

## Features

- Signup / Login with JWT auth and bcrypt password hashing
- Protected routes (frontend + backend)
- Create, read, update, delete tasks — fully isolated per user
- Task fields: title, description, status, priority, due date
- Dashboard stats: total, pending, in-progress, completed
- Filter by status, priority, search by title/description
- One-click status advance on task cards
- Responsive UI

## Setup & Run (No database install needed!)

### Prerequisites
- Node.js v18+  ← only thing you need

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

You'll see:
```
✅ SQLite database connected.
✅ Database synced.
🚀 Server running on port 5000
```

A `database.sqlite` file is auto-created in the backend folder — no setup needed.

### 2. Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 ✅

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Tasks (all require Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (filter: ?status, ?priority, ?search) |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/stats` | Get task counts |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Deployment

### Backend → Render.com
1. Push to GitHub
2. New Web Service → root dir: `backend`
3. Build: `npm install` | Start: `node server.js`
4. Add env vars from `.env.example`

### Frontend → Vercel
1. New Project → root dir: `frontend`
2. Add env var: `VITE_API_URL=https://your-render-url.onrender.com`
3. In `src/utils/api.js` change baseURL to: `import.meta.env.VITE_API_URL + '/api'`
