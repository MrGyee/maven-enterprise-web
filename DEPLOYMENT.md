# Deployment Guide

## Current architecture

- **Public site**: fully dynamic Next.js 16 App Router pages, no database
  dependency for reads beyond the local JSON store.
- **Admin CMS**: reads/writes `data/*.json` on disk (`src/lib/store/*.ts`)
  and saves uploaded images to `public/uploads/` (`src/app/api/upload/route.ts`,
  processed through `sharp`).
- **Auth**: signed-cookie sessions (`src/lib/auth/session.ts`, `src/proxy.ts`),
  credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `SESSION_SECRET` env vars.

## ⚠️ Blocker for Vercel (or any serverless host)

Vercel's serverless functions have a **read-only filesystem** except for
`/tmp`, and `/tmp` is wiped between invocations and not shared across
instances. That means, deployed as-is to Vercel:

- Admin edits (product/service/project/etc. changes) will appear to save
  successfully but **will not persist** — the next request may hit a
  different function instance with the old data, and everything resets on
  the next deploy.
- Image uploads through the admin UI will fail the same way.
- The public site (reads only) will work fine, since it just reads the
  JSON files bundled at deploy time.

**This needs to be fixed before the admin CMS is usable in production on
Vercel.** Two accounts are needed that I can't create on your behalf:

1. **Supabase** ([supabase.com](https://supabase.com), free tier is enough
   to start) — Postgres database + storage. `supabase/schema.sql` in this
   repo already mirrors every content type 1:1, ready to run against a new
   project.
2. **Cloudinary** ([cloudinary.com](https://cloudinary.com), free tier is
   enough to start) — image hosting/optimization, referenced throughout the
   original project spec.

Once you have both, share (via a secure channel, not chat):
- Supabase project URL + anon key + service role key
- Cloudinary cloud name + API key + API secret

...and I'll do the migration: swap `src/lib/store/*.ts` from file I/O to
Supabase queries (the repository-function signatures were written so call
sites don't change), point `/api/upload` at Cloudinary, and run
`supabase/schema.sql` to provision the tables.

**If you'd rather not wait**: deploying to a host with a persistent disk
(a VPS, Railway, Render, Fly.io, Docker on your own infrastructure) works
with the current code as-is — `data/` and `public/uploads/` just need to
live on a persistent volume, no migration required. Let me know if you'd
rather go this route.

## Environment variables

Set these in your hosting platform's dashboard (never commit them):

| Variable | Required | Notes |
| --- | --- | --- |
| `ADMIN_EMAIL` | Yes | Admin login email. |
| `ADMIN_PASSWORD` | Yes | Use a strong, unique password — not the dev value. |
| `SESSION_SECRET` | Yes | Generate with `openssl rand -base64 32`. Rotating it logs everyone out. |

Once the Supabase/Cloudinary migration lands, this table will grow to
include `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`CLOUDINARY_CLOUD_NAME`, etc.

`.env.local.example` in the repo root always reflects the current minimum
set.

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
   reload and after the next deploy. If it disappears, the Supabase
   migration above hasn't happened yet — don't rely on the admin CMS until
   it has.

## Post-deploy smoke test

- [ ] Homepage and a few product/service/project pages load with images
- [ ] Quote form and Contact form submit successfully
- [ ] WhatsApp floating button opens the right number
- [ ] `/sitemap.xml` and `/robots.txt` return valid content
- [ ] Admin login works and an edit persists (see above — this is the one
  most likely to fail before the Supabase migration)
- [ ] `/privacy-policy` and `/terms` are reachable from the footer
