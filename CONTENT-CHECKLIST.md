# Pre-Launch Content Checklist

Everything below is currently placeholder/mock content used to build and demo
the site. Every item marked **Editable via admin** can be updated at
`/admin/...` without touching code — log in at `/admin/login`.

Priority key: 🔴 Critical (legal/credibility risk if left as-is) · 🟡 High ·
🟢 Nice-to-have / can launch without.

## 🔴 Critical — must fix before launch

- **Testimonials** (`/admin/testimonials`) — all 6 are fictional names,
  quotes and photos. Publishing fabricated testimonials attributed to named
  people is a real legal/advertising-standards risk. Replace with real
  customer testimonials (get their permission to use name/photo) or remove
  the section.
- **Projects / portfolio** (`/admin/projects`) — all 10 case studies are
  fictional (including "before/after" claims). Replace with real completed
  projects, or take the Projects page down until you have real ones —
  showing fabricated project photography as your own work is a credibility
  and potential legal issue.
- **Team page** (`/admin/team`) — 4 fictional people with stock photos.
  Replace with your real team, or remove the "Meet the Team" section from
  About.
- **Business contact details** (`/admin/settings/business-info`) — phone
  numbers, WhatsApp number, email address, and street address are all
  placeholders. Every quote/contact form and the floating WhatsApp button
  depend on these being correct.
- **Domain name** — metadata and JSON-LD throughout the codebase assume
  `https://www.mavenenterprise.co.ke`. Confirm this is the real domain (or
  tell me the real one and I'll do a global find-and-replace) before launch,
  otherwise canonical URLs, Open Graph tags and structured data will point
  to a domain you don't own.
- **Admin password** — `.env.local` currently holds a dev-only password.
  Set a strong, unique `ADMIN_PASSWORD` and `SESSION_SECRET` as production
  environment variables (see DEPLOYMENT.md) — never reuse the dev values.

## 🟡 High priority

- **All photography site-wide** is hotlinked from Unsplash — hero rotation,
  category headers, all 78 product images, service galleries, project
  photos, team portraits, testimonial photos, blog covers. This is the
  single largest remaining content item. Replace with real Maven Enterprise
  photography via the image upload field on each admin form (drag-and-drop,
  auto-compressed to WebP).
- **Product catalogue** (`/admin/products`, 78 items) — realistic-sounding
  but invented products, prices and stock status. Review against your real
  SKU list; delete anything you don't actually stock, correct prices, add
  what's missing.
- **Brand partners** (`/admin/brands`) — all 10 names (AquaTech,
  ElegantFloors, etc.) are placeholders. Replace with brands you actually
  distribute, or remove the "Brands We Stock" section.
- **Google Maps embed** (`/admin/settings/business-info`) — currently a
  generic Nairobi-area embed, not your actual showroom location.
- **Social media links** (`/admin/settings/business-info`) — point to
  fictional handles. Update or remove any platform you're not actually on.
- **Privacy Policy & Terms of Service** — template pages have been added at
  `/privacy-policy` and `/terms`, but they're generic boilerplate and **must
  be reviewed by a lawyer** before launch, especially given the site
  collects personal data (name, phone, email) through five different forms
  — Kenya's Data Protection Act (2019) requires a proper privacy notice for
  this.

## 🟢 Lower priority — reasonable to launch with, refine later

- **Services** (`/admin/services`, 15 items) — generic but plausible
  descriptions of real service categories. Worth personalizing (pricing
  approach, specific process details) but not fabricating false claims like
  testimonials/projects do.
- **Blog posts** (`/admin/blog`, 6 articles) — generic evergreen advice
  content, not attributed to fake customers or claiming specific events.
  Fine as a starting point; refine over time and add more.
- **Categories/subcategories** (`/admin/categories`) — structure mirrors a
  typical interior supplier's catalogue; verify it matches your actual
  category breadth, adjust as needed.
- **Hero banners** (`/admin/hero-banners`) — currently 4 generic interior
  photos; swap for real branded photography when available.
- **Logo** — header/footer currently show a text "M" badge in emerald, not
  a real logo file. If you have a logo, let me know and I'll swap it in.

## Not content, but blocks a working admin CMS on Vercel

The admin CMS currently reads/writes local JSON files and saves uploaded
images to local disk. This works during development but **will not persist
on Vercel's serverless filesystem**. See `DEPLOYMENT.md` for what's needed
(Supabase account + Cloudinary account) before admin edits will reliably
save in production.
