<!--
  EcoScan README
  Auto-generated based on user's request — polished, professional, and actionable.
-->

# EcoScan — Material Intelligence for Smarter Disposal

[![EcoScan](https://img.shields.io/badge/EcoScan-Product%20Sustainability-0ea5a4?style=for-the-badge&logo=appveyor&logoColor=white)](https://github.com/gavin100305/EcoScan)
[![Vite](https://img.shields.io/badge/Vite-4.x-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2b6cb0?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

---

One-line: EcoScan analyzes product images to provide recyclability guidance, carbon-footprint estimates, and alternative sustainable suggestions — wrapped in a fast React + Vite frontend and a small Node/Express + Prisma backend.

This README gives you a concise, practical developer guide: how to run locally, how the pieces fit together, deployment notes, security reminders, and next steps.

## Highlights

- Image-based analysis pipeline (Cloudinary upload → Gemini Vision / AI analysis)
- Persists scan history with Prisma + PostgreSQL so users can review, compare, and export as PDF
- Framer Motion-powered UI for smooth animations and polished UX
- Supabase for authentication (OAuth + session management)
- Small, deployable Node/Express API with endpoints for scans, history, and user sync
- Client-side PDF export (jsPDF) for printable history reports

## Repository Structure

```
EcoScan/
├── backend/                # Express API, Prisma schema, controllers, routes
├── frontend/               # Vite + React app, pages, components, api client
├── .github/                # CI workflows (prisma migrate, lint, tests)
└── README.md
```

## Tech Stack

- Frontend: React (v19) + Vite, TailwindCSS, Framer Motion, jsPDF
- Backend: Node.js + Express, Prisma (Postgres), Cloudinary (image uploads), Gemini Vision API (analysis)
- Auth: Supabase (OAuth + session tokens)
- Database: PostgreSQL (Prisma)

## Quick Start — Local Development

Prereqs: Node.js >=18, PostgreSQL (or Supabase), yarn or npm

1. Clone the repo

```bash
git clone https://github.com/gavin100305/EcoScan.git
cd EcoScan
```

2. Backend setup

```bash
cd backend
npm install
# Copy .env.example -> .env and fill in values
# Example variables (see `.env.example` in repo or below):
# DATABASE_URL=postgresql://user:pass@host:6543/dbname
# SUPABASE_* keys, CLOUDINARY_*, GEMINI_API_KEY

npm run dev
```

3. Frontend setup

```bash
cd ../frontend
npm install
# Create .env with Vite variables (VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
npm run dev
```

Open http://localhost:5173

## Environment Variables (example keys)

Backend (`backend/.env`):

- DATABASE_URL
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- GEMINI_API_KEY
- CORS_ORIGIN

Frontend (`frontend/.env`):

- VITE_API_URL (e.g. `https://your-backend.onrender.com/api`)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_APP_URL (frontend origin for OAuth redirects)

> Security: Never commit real secrets. Use `.env.example` to document variables.

## Important Developer Notes

- Prisma & Migrations
  - Migrations must be applied to the production DB using `npx prisma migrate deploy`.
  - If you have an existing production DB with tables, create a baseline migration locally with `npx prisma migrate dev --create-only` and mark migrations applied on the remote with `npx prisma migrate resolve --applied <migration-name>` or via CI.

- Supabase Auth & OAuth
  - Add your frontend origin(s) to Supabase Redirect URLs.
  - In Google Cloud Console (or provider), add the Supabase callback `https://<your-project>.supabase.co/auth/v1/callback` as an authorized redirect URI.
  - Set `VITE_APP_URL` in frontend environment so the app always passes the correct `redirectTo` value.

- Cold-starts & Render free tier
  - Render free services sleep after inactivity; first request may take 30–60s to wake. Use longer client timeouts or a keep-alive ping if needed.

## Exposed API (selected)

- POST `/api/scans` — upload image (multipart) and run analysis
- GET `/api/scans` — list user scans (history)
- DELETE `/api/scans/:id` — delete scan
- POST `/api/user/sync-user` — sync user to DB after OAuth sign-in

Check `backend/src/routes` for full endpoints and request/response shapes.

## Frontend Features

- Scan page: upload an image, call the backend analysis, show results
- Result view: product name, material, recyclability, carbon footprint, disposal method, alternative suggestions
- History: list of previous scans, delete, compare, and export PDF (client-side via jsPDF)
- Smooth animations using Framer Motion across pages

## PDF Export

- History includes an `Export PDF` button which generates a professional black-and-white PDF containing each scan's details.
- Implemented client-side using `jspdf` (no backend change required).

## Deployment

- Backend: Render (service configured via `backend/render.yaml`) — set env vars on the Render dashboard, and Render will run `npx prisma generate` and `npx prisma migrate deploy` during build if configured.
- Frontend: Vercel — add `VITE_API_URL` (to your Render backend) and `VITE_APP_URL` as environment variables in Vercel, then deploy.

Deployment checklist:

1. Add production env vars to Render and Vercel (use secret management)
2. If using Supabase, set Redirect URLs to your Vercel origin
3. If migrating an existing DB, mark migrations applied (see Prisma baseline guidance)
4. Deploy backend, verify logs, then deploy frontend

## CI / Migrations

- A GitHub Actions workflow (e.g., `.github/workflows/prisma-migrate.yml`) can be used to run `prisma migrate deploy` or mark migrations applied via CI using `DATABASE_URL` stored in GitHub Secrets.

## Security & Secrets (urgent)

- If any secret was accidentally committed (e.g., `.env`), rotate the secrets immediately: database password, Supabase service role key, Cloudinary secret, Gemini key.
- Remove secrets from git history using `git filter-repo` or BFG and force-push only after coordination.

## Troubleshooting

- Build errors on Vercel referencing missing modules: ensure `package-lock.json` or `yarn.lock` is committed and `package.json` lists the dependency.
- Prisma P1001 (can't reach DB): use the correct Supabase connection (session mode / direct connection) and ensure Render can reach the DB (IPv4 vs IPv6 issues).
- OAuth redirects landing on `localhost`: set `VITE_APP_URL` correctly and ensure Supabase & Google redirect URIs include production origins.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Open a PR with tests and a clear description

## Contact & Credits

- Maintainer: Gavin Soares — https://github.com/gavin100305
- Project: EcoScan — data-driven product sustainability insights

---