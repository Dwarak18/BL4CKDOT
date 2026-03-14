# BL4CKDOT Platform

BL4CKDOT is a futuristic innovation ecosystem platform where students, innovators, and companies build real technology together.

## Stack

- Frontend: Next.js, React, TailwindCSS, Framer Motion, Three.js / React Three Fiber
- Backend API: Next.js Route Handlers (Node runtime) + optional Express server (`backend/server.js`)
- Database: MongoDB Atlas via Mongoose
- Auth: JWT role-based access (`student`, `innovator`, `company`, `admin`)
- AI: DOT assistant endpoint + semantic search endpoint over project/research/submission data

## Core Features Implemented

- Advanced 3D hero animation sequence (idea to network to sphere)
- Updated navigation structure: Home, Build With Us, Innovation Lab, Projects, Apprenticeship, Research, Timeline, Contact
- Innovation Lab submissions page with tabs:
	- For Students
	- For Innovators
	- For Companies
- Apprenticeship application persistence (`ApprenticeshipApplications`)
- Contact terminal form persistence (`ContactMessages`)
- Admin dashboard for reviewing:
	- apprenticeship applications
	- innovation submissions
	- contact messages
- DOT chatbot connected to backend `/api/dot`
- AI project/research/innovation search page (`/search`)
- Radar animation connected to real backend data (`/api/radar/activity`)
- Vision timeline page (`/timeline`) backed by `TimelineEvents`
- Advanced terminal backend scaffold via WebSocket (`backend/server.js`)

## Mongo Collections

- `Users`
- `ApprenticeshipApplications`
- `ContactMessages`
- `InnovationSubmissions`
- `Projects`
- `Research`
- `TimelineEvents`

## Environment Variables

Create `.env.local`:

```bash
MONGODB_URI=<mongodb-connection-string>
MONGODB_DB=bl4ckdot
JWT_SECRET=<strong-secret>

# Admin bootstrap
ADMIN_SEED_SECRET=<seed-secret>
ADMIN_EMAIL=admin@bl4ckdot.dev
ADMIN_PASSWORD=<strong-admin-password>

# Optional Express backend
EXPRESS_PORT=4000
```

## Run

```bash
npm install
npm run dev
```

Optional Express backend (WebSocket terminal scaffold):

```bash
npm run dev:backend
```

## Admin Setup

1. Start app with env vars.
2. Seed admin account:

```bash
curl -X POST http://localhost:3000/api/auth/seed-admin -H "x-admin-seed-secret: <ADMIN_SEED_SECRET>"
```

3. Sign in at `/admin` using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
