# fintechabc.com — crypto & finance community (Phase 1)

A Reddit-style forum built with Next.js + Supabase. **Phase 1** (this drop): authentication,
topic boards, posts, threaded comments, and voting. Paid groups (Stripe) and moderation
tools come in Phases 2-3.

## Status

- Supabase project provisioned and schema applied (tables + Row Level Security + 2 starter boards)
- Deployed to Vercel
- GitHub repo: https://github.com/kpi990/fintechabc-forum

## What's built so far

- Email/password sign up and login (Supabase Auth)
- Topic boards (`/board/[slug]`)
- Post creation and threaded comments
- Upvote/downvote on posts and comments
- Row Level Security on every table — the database itself enforces who can read/write what

## What's NOT built yet (coming in later sessions)

- Stripe subscriptions / paid private boards
- Moderator tools (remove, ban, report queue)
- Karma display, notifications
- Custom domain wiring for fintechabc.com

## Environment variables

Set these in Vercel (Project Settings > Environment Variables) and locally in `.env.local`
(see `.env.local.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Project structure

```
schema.sql                     — full DB schema (already applied to the live project)
src/lib/supabase/client.ts     — Supabase client for the browser
src/lib/supabase/server.ts     — Supabase client for server-rendered pages
middleware.ts                  — keeps login sessions refreshed
src/app/page.tsx               — home page, lists boards
src/app/board/[slug]/          — board page + new-post form
src/app/post/[id]/             — post detail + comments
src/app/login, src/app/signup  — auth pages
src/app/api/vote/               — upvote/downvote endpoint
```
