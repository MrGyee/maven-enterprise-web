# Deployment Guide

## Current architecture

- **Public site**: fully dynamic Next.js 16 App Router pages, reading
  content from Supabase Postgres on every request (`src/lib/data/*.ts` ->
  `src/lib/store/*.ts` -> `src/lib/supabase/server-client.ts`).
- **Admin CMS**: reads/writes the same Supabase tables (`supabase/schema.sql`)
  and saves uploaded images to Cloudinary (`src/app/api/upload/route.ts`),
  which also handles resizing and format optimization on upload.
- **Auth**: signed-cookie sessions (`src/lib/auth/session.ts`, `src/proxy.ts`),
  credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `SESSION_SECRET` env
  vars — unrelated to Supabase Auth, unchanged by the migration below.

This replaces the earlier local-JSON-file + on-disk-upload design, which
didn't work on Vercel (serverless functions have a read-only filesystem
outside `/tmp`, and `/tmp` is wiped between invocations) — admin edits and
image uploads would appear to succeed but not persist. Supabase and
Cloudinary are both external, persistent services, so that limitation no
longer applies.

## One-time setup (new environment / new Supabase project)

1. Create a [Supabase](https://supabase.com) project (free tier is enough to
   start) and a [Cloudinary](https://cloudinary.com) account (same).
2. In the Supabase SQL Editor, run `supabase/schema.sql` from this repo. It
   creates every content and lead table with RLS enabled and no policies —
   the app only ever connects with the `service_role` key (server-only,
   bypasses RLS), so the tables are unreachable through Supabase's
   auto-generated REST API for any other role.
3. Copy `.env.local.example` to `.env.local` and fill in the real values
   (Supabase: Settings -> API; Cloudinary: dashboard home page).
4. Seed the database from the placeholder content in `data/*.json`:
   ```bash
   npm run seed:supabase
   ```
   Only run this once against a fresh database — see the comment at the top
   of `scripts/seed-supabase.ts` for why re-running it isn't idempotent.
5. `npm run dev`, log in to `/admin`, and confirm the public site renders
   the seeded content.

## Environment variables

Set these in your hosting platform's dashboard (never commit them):

| Variable | Required | Notes |
| --- | --- | --- |
| `ADMIN_EMAIL` | Yes | Admin login email. |
| `ADMIN_PASSWORD` | Yes | Use a strong, unique password — not the dev value. |
| `SESSION_SECRET` | Yes | Generate with `openssl rand -base64 32`. Rotating it logs everyone out. |
| `SUPABASE_URL` | Yes | Project URL, Settings -> API. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Settings -> API. Server-only — never expose to the client. |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary dashboard home page. |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary dashboard home page. |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary dashboard home page — keep secret. |

`.env.local.example` in the repo root always reflects the current full set.

## Domain

Metadata, canonical URLs, sitemap, robots.txt and JSON-LD throughout the
codebase assume `https://www.mavenenterprise.co.ke`. If that's not the
final domain, search the codebase for that string (it appears in
`src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, and
`src/lib/data/business-info.ts`) and update it — or tell me the real domain
and I'll do it in one pass.

## Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project in the Vercel dashboard, framework preset "Next.js"
   (auto-detected).
3. Add the environment variables above under Project Settings →
   Environment Variables.
4. Deploy. The build runs `next build`; no special build command needed.
5. **Before announcing the site is live**: log in to `/admin`, make a small
   edit (e.g. add a test FAQ), and confirm it's still there after a page
   reload and after the next deploy — this proves the deployed instance is
   actually reaching Supabase and not silently failing.

## Post-deploy smoke test

- [ ] Homepage and a few product/service/project pages load with images
- [ ] Quote form and Contact form submit successfully
- [ ] WhatsApp floating button opens the right number
- [ ] `/sitemap.xml` and `/robots.txt` return valid content
- [ ] Admin login works and an edit persists after a reload and a redeploy
- [ ] Uploading an image through an admin form returns a `res.cloudinary.com`
  URL and renders correctly
- [ ] `/privacy-policy` and `/terms` are reachable from the footer
