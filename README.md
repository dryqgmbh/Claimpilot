# ScopePilot.ai

> Pre-audit your restoration claim before the carrier does.

ScopePilot is an AI-powered Claim QA layer for US restoration contractors
(water mitigation, mold, fire, roofing insurance, reconstruction). It sits
between existing field & estimating tools (Xactimate, CompanyCam, Encircle,
DASH, Albi, JobNimbus) and final claim submission. Contractors upload their
claim file; ScopePilot scores documentation strength, surfaces missing
evidence, predicts adjuster questions, and exports submission-ready reports.

This repository contains the **MVP web app** — a Next.js 15 / TypeScript /
Tailwind frontend, a full design system, a complete data model, the
Claim Quality Score engine, all primary screens, and 3 fully-populated demo
claims (Water Cat 2 · Mold · Roofing Hail).

## What ships in this build

- **Marketing site:** Landing page, Pricing, Login, Sign-up
- **App shell:** Sidebar + Topbar + branded layout
- **Dashboard:** KPIs, Recent Claims, Top Open Tasks
- **Claim Pipeline:** Kanban (7 statuses) + table view + filters
- **New Claim wizard:** Claim metadata + 8 upload slots + audit preferences
- **Claim Detail (10 tabs):**
  - Overview · Files · Estimate Items · Evidence Match · Missing Docs
  - Adjuster Questions · Logs · Narrative · Tasks · Reports
- **Global pages:** Tasks, Reports, Team & Roles, Billing, Settings
- **Claim Quality Score engine:** 10 weighted sub-scores, bands, anti-hallucination floor

## Stack

- **Next.js 15** (App Router, React 19 RC)
- **TypeScript** strict
- **Tailwind CSS** with custom design tokens
- **lucide-react** icons, **clsx + tailwind-merge** utilities
- **zod** for schema validation
- Mock data in `src/lib/mock-data.ts` — replaceable with a real DB layer

## Getting started

```bash
npm install
npm run dev
# open http://localhost:3000
```

Other scripts:

```bash
npm run build     # production build
npm run start     # serve the production build
npm run typecheck # tsc --noEmit
npm run lint      # next lint
```

## Demo claims

After signing up (form submit currently bypasses real auth), open any of these:

| Claim | Type | Score | URL |
| --- | --- | --- | --- |
| Robert & Diane Mendez | Water Cat 2 (Houston, TX) | 67 — Needs Review | `/app/claims/C-2026-00148` |
| Helen Park | Mold (Tampa, FL) | 58 — High Risk | `/app/claims/C-2026-00161` |
| Greg Tilman | Roof Hail (Atlanta, GA) | 84 — Strong | `/app/claims/C-2026-00177` |

Each claim has line items, missing-docs lists, forecasted adjuster questions,
findings, tasks, drying / moisture logs (where applicable) and a narrative draft.

## Project structure

```
src/
├── app/                     # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── pricing/             # Pricing
│   ├── login/, signup/      # Auth screens
│   └── app/                 # Authenticated app
│       ├── layout.tsx       # Sidebar + Topbar shell
│       ├── dashboard/
│       ├── onboarding/
│       ├── claims/
│       │   ├── page.tsx     # Pipeline (Kanban + table)
│       │   ├── new/         # New Claim wizard
│       │   └── [id]/        # Claim Detail (10-tab layout)
│       ├── tasks/, reports/, team/, billing/, settings/
├── components/
│   ├── ui/                  # Design system primitives
│   ├── marketing/           # Header/footer
│   ├── app/                 # App shell components
│   ├── score-ring.tsx
│   └── sub-score-card.tsx
├── lib/
│   ├── scoring.ts           # Claim Quality Score engine
│   ├── mock-data.ts         # 3 demo claims (full payloads)
│   └── utils.ts
└── types/
    └── index.ts             # Domain model
```

## Claim Quality Score

Aggregate of 10 weighted sub-scores (`src/lib/scoring.ts`):

| Sub-score | Weight |
| --- | --- |
| Estimate-to-Evidence Match | 15% |
| Photo Completeness | 12% |
| Moisture Documentation | 12% |
| Adjuster Risk | 12% |
| Drying Log Quality | 10% |
| Overall Documentation Strength | 10% |
| Equipment Justification | 8% |
| Room-by-Room Consistency | 8% |
| Timeline Consistency | 7% |
| Supplement Readiness | 6% |

**Bands:** 90–100 Submission Ready · 75–89 Strong · 60–74 Needs Review ·
40–59 High Risk · 0–39 Not Submission Ready.

**Floor rule:** if any sub-score is below 30, overall is capped at 79
to prevent green scores hiding critical gaps.

## Design system

Colour tokens (Tailwind config) follow the product spec:

- Deep Navy `#0B1220` · Slate `#1E293B` · App background `#F8FAFC`
- Primary Blue `#2563EB` · Success `#16A34A` · Warning `#F59E0B` · Risk `#DC2626`
- Border Gray `#E2E8F0` · Text Dark `#111827`

UI primitives in `src/components/ui/`: `Button`, `Card`, `Badge`, `Table`,
`Tabs`, `Progress`, `RiskBadge`.

## What is NOT in this build (intentionally)

These are part of the v1 backend / future modules:

- Real auth (Clerk/Supabase) — forms currently route to next page
- Real database (Postgres + pgvector) — replaced by an in-process store
  (`src/lib/store.ts`); same read/write API as a real DB layer would expose
- File upload to durable storage (S3 / Supabase Storage) — current endpoint
  registers metadata + classifies the file, no bytes are persisted
- Vision / Textract parsing for photos and Xactimate PDFs
- Stripe checkout integration
- Background jobs (Inngest / Trigger.dev) — audit currently runs in-process
- Integrations (CompanyCam, Encircle, DASH)
- Mobile app

The data model and component contracts are designed so each of these can be
wired in without restructuring the frontend.

## AI pipeline

The audit pipeline is implemented end-to-end:

- **Schemas** — Zod schemas for classifier, auditor and verifier outputs
  (`src/lib/ai/schemas.ts`)
- **Prompts** — system prompts with hard guardrails plus JSON Schemas for
  Anthropic tool use (`src/lib/ai/prompts.ts`)
- **Client** — Anthropic SDK with model routing (Haiku classifier, Sonnet
  auditor, Opus verifier) plus a deterministic mock fallback when
  `ANTHROPIC_API_KEY` is unset (`src/lib/ai/client.ts`)
- **Orchestrator** — drives the audit: parsing → matching → scoring →
  verifying → done. Critical findings are re-verified by Opus and degraded
  to `needs review` if not supported (`src/lib/ai/orchestrator.ts`)
- **Progress UI** — `/app/audit/[id]` polls `/api/claims/[id]/audit` in real
  time and redirects to the claim detail when the score is ready
- **API routes**
  - `POST /api/claims` — create a claim
  - `GET  /api/claims` — list claims
  - `GET  /api/claims/[id]` — fetch a single claim
  - `POST /api/claims/[id]/files` — upload + classify files
  - `POST /api/claims/[id]/audit` — kick off an audit
  - `GET  /api/claims/[id]/audit` — poll audit job status
  - `GET  /api/claims/[id]/reports/[kind]` — render a PDF report

## PDF reports

Three report types are rendered server-side with `@react-pdf/renderer`:

- `claim_qa` — full claim QA report (sub-scores, top findings, missing
  docs, adjuster forecast) — typically 2 pages
- `missing_docs` — open documentation grouped by assignee
- `adjuster_risk` — forecasted adjuster questions with suggested
  pre-answers

Each PDF carries the legal footer ("Documentation QA tool · Not a public
adjuster · Findings based solely on uploaded materials").

## Positioning & legal

ScopePilot is a **documentation quality and claim file readiness tool**.

- **NOT** a public adjuster
- **NOT** a law firm or legal service
- **NOT** an estimator replacement
- Does **NOT** negotiate, settle, or represent any party in an insurance claim
- Does **NOT** guarantee insurance approval, coverage, or payment outcome
- All findings are based solely on documentation uploaded by the user
- Contractor remains responsible for final claim submission

These disclaimers are surfaced in the marketing footer, app sidebar and
relevant settings/page contexts.

## Next implementation steps

1. Wire **Clerk** auth and replace `/login` + `/signup` form actions
2. Provision **Postgres** (Supabase or Neon) and replace `mock-data.ts` with
   real queries; migrate the schema described in `src/types/index.ts`
3. Implement **file upload** (signed URLs → S3/Supabase Storage)
4. Implement **AI Audit pipeline**: AWS Textract → structured line items →
   Claude (Sonnet) auditor → Claude (Opus) verifier on critical findings
5. Wire **Stripe** billing and meter audits per organization
6. Implement **report generation** (Playwright PDF render)
7. Add **CompanyCam / Encircle** integration adapters
8. Implement **audit trail** persistence

## License

Proprietary — © ScopePilot Inc. All rights reserved.
