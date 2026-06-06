<div align="center">

# 🏬 Store Rating App

### Full-Stack Intern Challenge Submission

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://store-rating-app-six-delta.vercel.app)
[![API](https://img.shields.io/badge/🔗_Backend_API-Render-46E3B7?style=for-the-badge&logo=render)](https://store-rating-app-qbev.onrender.com/api)

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 Overview

A full-stack web application where users can discover and rate stores on a **1–5 star** scale. Built as part of a fullstack intern coding challenge — the app features **three distinct role-based dashboards**, secure JWT authentication, clean REST APIs, and a responsive UI with real-time feedback.

> Built solo by **Yogesh** (B.E. AI & ML, Zeal College of Engineering, Pune) — a full-stack developer with MERN, Spring Boot, and AI integration experience.

---

## ✨ Features

### 👑 System Administrator
- Aggregate dashboard: total users, stores, and ratings at a glance
- Add & manage users — searchable, filterable by role, sortable, paginated
- Add & manage stores — searchable, sortable, paginated with avg. rating display
- View user detail pages — shows avg. rating if the user is a Store Owner

### 👤 Normal User
- Register, log in, change password
- Browse all stores — search by name or address
- Store cards show: name, address, overall rating, and **your own rating**
- Submit or update a 1–5 star rating with one click
- Responsive store grid with pagination

### 🏪 Store Owner
- Log in, change password
- Dashboard displaying own store's average rating (rendered as stars ⭐)
- Full list of raters: username, their rating, and submission date

### ✅ Validation (Frontend + Backend)
| Field | Rule |
|-------|------|
| Name | 20–60 characters |
| Address | Max 400 characters |
| Password | 8–16 chars, min. 1 uppercase + 1 special character |
| Email | Standard RFC format |

### 🛡️ Security & Quality
- JWT Bearer token auth
- `helmet` for HTTP security headers
- Rate limiting: 100 req / 15 min on auth routes
- Input sanitization + CORS
- Global error handler, 404 page, loading spinners, toast notifications
- All tables: sortable (Name, Email) + paginated

---

## 🖥️ Live Demo

| | URL |
|--|--|
| **Frontend** | [store-rating-app-six-delta.vercel.app](https://store-rating-app-six-delta.vercel.app) |
| **Backend API** | [store-rating-app-qbev.onrender.com/api](https://store-rating-app-qbev.onrender.com/api) |
| **Health Check** | [/health](https://store-rating-app-qbev.onrender.com/health) |

> ⚠️ Backend runs on Render's free tier — first request may take ~30s to cold start.

---

## 🔐 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@example.com` | `Admin@2026` |
| **Store Owner** | `owner@example.com` | `Owner@2026` |
| **Normal User** | `user@example.com` | `User@2026` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | PostgreSQL (hosted on Supabase) |
| **Frontend** | React 18, Vite, TailwindCSS, React Router v6 |
| **Forms** | react-hook-form + Zod validation |
| **Auth** | JWT (Bearer token, stored in localStorage) |
| **Deployment** | Backend → Render · Frontend → Vercel |

---

## 📁 Project Structure

```
store-rating-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # DB models & relations
│   │   └── migrations/
│   ├── src/
│   │   ├── config/                # DB & env config
│   │   ├── controllers/           # Route handlers
│   │   ├── middleware/            # Auth, error handling, rate limiting
│   │   ├── routes/                # Express routers
│   │   ├── services/              # Business logic layer
│   │   └── utils/                 # Helpers & validators
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/            # Reusable UI components
    │   ├── context/               # Auth context (React Context API)
    │   ├── pages/                 # Role-based page views
    │   ├── services/              # Axios API calls
    │   ├── utils/                 # Formatters, helpers
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js v18+
- PostgreSQL (or a free [Supabase](https://supabase.com) project)
- Git

### 1. Clone

```bash
git clone https://github.com/yogesh-123231/store-rating-app.git
cd store-rating-app
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, FRONTEND_URL
npm install
npx prisma migrate dev --name init
npm run dev
# → http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
# → http://localhost:5173
```

### 4. Environment Variables

**Backend `.env`**
```env
PORT=5000
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://...?pgbouncer=true"
JWT_SECRET="your-secret-key"
FRONTEND_URL="http://localhost:5173"
NODE_ENV=development
```

**Frontend `.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing

Use the included Postman collection (`backend/postman-collection.json`) to test all API endpoints.

For manual testing, log in with each role's credentials and verify the role-specific dashboard and permissions.

---

## 🌍 Deployment

| Layer | Platform | Config |
|-------|----------|--------|
| **Backend** | [Render](https://render.com) | Build: `npm install && npx prisma generate` · Start: `npm start` |
| **Frontend** | [Vercel](https://vercel.com) | Build: `npm run build` · Output: `dist` · Env: `VITE_API_URL` |

---

## 👤 Author

**Yogesh**
B.E. AI & ML · Zeal College of Engineering, Pune (CGPA 8.5+)
Full-Stack Developer — MERN · Spring Boot · AI Integration

[![GitHub](https://img.shields.io/badge/GitHub-yogesh--123231-181717?logo=github)](https://github.com/yogesh-123231)

---

<div align="center">
  <sub>Built with ☕ for a fullstack internship challenge · 2026</sub>
</div>
