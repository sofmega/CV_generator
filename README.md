# CVPro - AI CV and Cover Letter Generator

## Badges
[![Node.js](https://img.shields.io/badge/Node.js-20-339933)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://www.typescriptlang.org/)

Replace `<your-github-username>/<your-repo>` with your actual GitHub repo path so the workflow badges render.

CVPro is a full-stack product that turns a raw resume and a job description into a tailored, recruiter-ready CV or cover letter. It combines a polished React front end with a production-minded Node/Express API, OpenAI-powered generation, Stripe subscriptions, and Supabase for auth, storage, and persistence.

This repository includes both the customer-facing application and the backend services that power AI generation, file parsing, PDF rendering, billing, usage limits, and feedback collection.

## Why this project stands out
- End-to-end product: onboarding, upload flow, AI generation, PDF preview, downloads, pricing, billing portal, and account management
- Production-minded backend: request IDs, structured logs, rate limits, usage limits, and Stripe webhook safety checks
- Real business logic: subscriptions and plan-based quotas, idempotent webhook handling, and persistent usage tracking
- Document intelligence: PDF/DOCX/TXT parsing, structured CV extraction, and PDF template rendering
- Cloud-ready: Dockerfile for backend, Cloud Build deployment to Cloud Run, and Vercel-ready frontend

## Product highlights
- CV and cover letter generation tailored to a specific job offer
- Multi-step UI with progress feedback, PDF preview, and downloads
- Supabase Auth (email/password + Google OAuth) with secure JWT-protected APIs
- Stripe checkout and billing portal for Starter and Pro plans
- Usage-based gating: daily and monthly limits by plan
- Feedback capture and blog content for marketing and retention

## Screenshots
![CVPro Logo](frontend/public/logo.png)

Add real UI screenshots to make this README pop. Recommended structure:
- `docs/screenshots/home.png`
- `docs/screenshots/generator-stepper.png`
- `docs/screenshots/pdf-preview.png`
- `docs/screenshots/pricing.png`

Example usage:
```
![Home](docs/screenshots/home.png)
![Generator](docs/screenshots/generator-stepper.png)
![PDF Preview](docs/screenshots/pdf-preview.png)
![Pricing](docs/screenshots/pricing.png)
```

## Architecture overview
- Frontend (React + Vite) handles UX, auth, and document flow
- Backend (Node + Express) handles auth verification, CV extraction, AI generation, PDF rendering, and billing
- Supabase provides auth, Postgres data, and storage for uploaded CVs
- Stripe manages subscriptions, with webhooks updating plan status

```mermaid
flowchart LR
  UI[React Frontend] -->|JWT| API[Express API]
  UI -->|Supabase Auth| SBAuth[Supabase Auth]
  API -->|Parse CV| Storage[Supabase Storage]
  API -->|Generate CV or LM| OpenAI[OpenAI Responses API]
  API -->|Persist usage| DB[Postgres via Supabase]
  UI -->|Checkout| Stripe[Stripe]
  Stripe -->|Webhooks| API
```

## Tech stack
- Frontend: React 19, React Router, Vite, TypeScript, Tailwind CSS, PDF.js, React Helmet
- Backend: Node.js, Express, Prisma, OpenAI SDK, Stripe, Supabase JS, PDFKit, pdf-parse, mammoth
- Platform: Docker, Cloud Run (via Cloud Build), Vercel-ready frontend
- Testing: Vitest + Supertest (backend)

## Repository layout
- `backend/` Express API, Prisma schema, Stripe webhooks, AI services
- `frontend/` React app, auth flow, generator UX, pricing and blog
- `.github/` CI or workflow configuration

## Key flows
### 1) Generate a CV or cover letter
1. User authenticates with Supabase
2. User uploads a resume (PDF, DOCX, or TXT)
3. Backend stores file in Supabase Storage and extracts text
4. User pastes a job description
5. Backend calls OpenAI to generate tailored content
6. PDF template renders the result for download

### 2) Billing and usage enforcement
1. User starts Stripe Checkout from the pricing page
2. Webhooks update the user plan and usage limits
3. Every generation request passes:
   - auth middleware
   - per-user rate limiting
   - usage quota enforcement

## API surface (backend)
All protected routes require `Authorization: Bearer <token>` from Supabase Auth.

- `POST /extract-cv` - Upload CV (multipart/form-data, `cv` file), returns extracted text
- `POST /cv/text` - Generate tailored CV text
- `POST /cv/pdf` - Generate tailored CV PDF
- `POST /lm/pdf` - Generate tailored cover letter PDF
- `POST /payments/create-checkout-session` - Create Stripe checkout session
- `POST /billing/portal` - Create Stripe billing portal session
- `POST /webhooks/stripe` - Stripe webhooks (raw body)
- `GET /me/usage` - Current plan and usage counters
- `POST /feedback` - Create feedback item
- `POST /internal/cleanup-cvs` - Cleanup old CV files (protected by cron secret)

## Data model (Prisma)
- `profiles` - plan, subscription status, usage counters, Stripe metadata
- `applications` - job description, CV text, generated output, and user linkage
- `feedbacks` - in-app feedback with user context
- `stripe_events` - webhook idempotency store

## Environment variables
Create separate `.env` files for `backend/` and `frontend/`.

### Backend (`backend/.env`)
```
PORT=8080
FRONTEND_URL=https://your-frontend-domain.com
CRON_SECRET=replace-me

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=replace-me
SUPABASE_SERVICE_ROLE_KEY=replace-me

# OpenAI
OPENAI_API_KEY=replace-me

# Stripe
STRIPE_SECRET_KEY=replace-me
STRIPE_WEBHOOK_SECRET=replace-me
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_yyy

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
DIRECT_URL=postgresql://user:pass@host:5432/db
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:8080
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=replace-me
VITE_SITE_URL=http://localhost:5173
VITE_STRIPE_PRICE_STARTER=price_xxx
VITE_STRIPE_PRICE_PRO=price_yyy
```

## Local development
### Backend
```
cd backend
npm install
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

### Tests (backend)
```
cd backend
npm test
```

## Deployment notes
- Backend ships with a `Dockerfile` and a `cloudbuild.yaml` for Cloud Run deployment.
- Frontend is Vite-based and includes `vercel.json` for Vercel deployment.

## Design decisions (why this architecture)
- Supabase Auth provides JWTs that the backend verifies per request, enabling a clean separation of frontend auth and backend authorization.
- Uploaded CVs are stored in Supabase Storage before parsing, keeping file handling consistent and enabling lifecycle cleanup jobs.
- Usage enforcement is layered: auth → rate limits → plan-based quotas, so abusive traffic and overuse are both handled.
- Stripe webhooks are made idempotent with a dedicated `stripe_events` table to prevent duplicate billing state updates.
- PDF rendering is done server-side to ensure consistent output and easy download flows for users.

## CI / quality gates
- `CI` workflow runs backend tests and frontend build checks on pushes to `develop` and PRs to `main`.
- `Backend PROD` workflow runs tests, applies Prisma migrations, and deploys to Cloud Run on `main`.

## Scale-up ideas (future roadmap)
- Queue-based generation with RabbitMQ for reliable async processing, retries, and backpressure
- Separate worker service for AI generation and PDF rendering (decouple API latency)
- Redis caching for recent generations and plan/usage lookups
- Webhook event store with replay dashboard and dead-letter queue for failed events
- Multi-tenant rate limiting and per-plan concurrency caps
- Document storage lifecycle rules (auto-expire CV uploads after N days)
- Streaming generation for faster first-byte response in the UI
- Model routing (batch, fast, and premium tiers) for cost and quality control
- Observability stack: structured logs, traces, and per-endpoint latency dashboards

## What recruiters can evaluate quickly
- Product thinking: pricing, onboarding, blog content, feedback loop
- System design: auth, billing, quotas, rate limits, storage, and webhooks
- Engineering quality: modular services, Prisma data model, and test coverage
- Deployability: Dockerized backend and cloud deployment scripts

---

If you are reviewing this repository, start with:
- `frontend/src/App.tsx` for the route map
- `backend/src/routes/` for API endpoints
- `backend/src/services/` for AI generation, storage, and billing logic
