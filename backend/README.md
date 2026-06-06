# Store Rating API – Backend

REST API for a store rating platform with three roles: **Admin**, **Normal User**, and **Store Owner**.

## Tech Stack

- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT authentication
- Zod validation

## Prerequisites

- Node.js 18+
- PostgreSQL (local or cloud, e.g. Supabase, Neon, Railway)

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/rating_app"
JWT_SECRET="your_super_secret_key_change_me"
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `NODE_ENV` | `development` or `production` |
| `FRONTEND_URL` | Allowed CORS origin |

> Never commit `.env` to version control.

## Installation

```bash
cd backend
npm install
```

## Database Setup

1. Create a PostgreSQL database (e.g. `rating_app`).
2. Update `DATABASE_URL` in `.env`.
3. Run migrations:

```bash
npx prisma migrate dev
```

4. (Optional) Seed the database:

```bash
npx prisma db seed
```

5. Generate Prisma client (if needed):

```bash
npx prisma generate
```

## Running the Server

**Development** (with auto-reload):

```bash
npm run dev
```

**Production**:

```bash
npm start
```

Server runs at `http://localhost:5000` (or your configured `PORT`).

Verify with:

```bash
GET http://localhost:5000/health
```

## API Overview

Base URL: `/api`

| Group | Endpoints |
|-------|-----------|
| **Auth** | `POST /auth/register`, `POST /auth/login`, `PUT /auth/change-password` |
| **Admin** | `POST /admin/users`, `POST /admin/stores`, `GET /admin/dashboard`, `GET /admin/users`, `GET /admin/users/:id`, `GET /admin/stores` |
| **Stores** | `GET /stores`, `POST /ratings` |
| **Owner** | `GET /owner/store`, `GET /owner/ratings` |

Authenticated requests require:

```
Authorization: Bearer <token>
```

## Postman Collection

Import [`postman-collection.json`](postman-collection.json) into Postman.

1. Set the `baseUrl` variable (default: `http://localhost:5000`).
2. Run **Auth → Login** – the `token` variable is saved automatically.
3. Use other requests with the saved token.

## Security Features

- **Helmet** – security HTTP headers
- **Rate limiting** – auth endpoints limited to 100 requests per 15 minutes per IP
- **Input sanitization** – trims strings and strips HTML/script tags
- **CORS** – restricted to `FRONTEND_URL`
- **bcrypt** – password hashing (salt rounds: 10)
- **JWT** – 7-day token expiry

## Project Structure

```
backend/
├── prisma/           # Schema and migrations
├── src/
│   ├── config/       # Prisma client
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth, validation, errors, sanitization
│   ├── routes/       # Express routers
│   └── utils/        # Helpers and Zod schemas
├── server.js         # Entry point
├── postman-collection.json
└── README.md
```
