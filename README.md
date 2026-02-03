# AI News Dashboard

A curated AI news dashboard with Africa and Global tabs plus an admin curation workflow.

## Setup

1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies.
3. Initialize the database.

```bash
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
```

To seed sources, update `prisma/sources.sample.json` with real RSS/Atom URLs and set `SEED_SOURCES_PATH` before running `npm run db:seed`. The sample file contains placeholder URLs that should be replaced.

## Run

```bash
npm run dev
```

## Cron ingestion

Call `POST /api/cron/ingest` hourly. If `CRON_SECRET` is set, include header `x-cron-secret`.

## AI-only filtering

Ingestion only keeps stories that match AI-related keywords (e.g., AI, artificial intelligence, machine learning, LLM, GPT, ChatGPT, Claude, Gemini, DeepMind, OpenAI). Update `src/lib/ai-filter.ts` to customize the matching logic.

## Africa-only filtering

For Africa sources, ingestion also requires an Africa match (country/city/region names). Stories from Africa sources that do not mention Africa are skipped so the Africa tab stays truly Africa-specific. Update the Africa keyword list in `src/lib/ai-filter.ts`.
