-- Maven Enterprise Ltd — Phase 2 Supabase schema
-- Not run against any live project yet. Checked in so the mock data layer in
-- src/lib/data/*.ts has a straightforward, drop-in migration target once a
-- Supabase project is provisioned. Mirrors the TypeScript types in
-- src/lib/data/types.ts field-for-field.

create extension if not exists "pgcrypto";

create table categories (
  slug text primary key,
  name text not null,
  description text not null,
  hero_image_url text not null,
  hero_image_alt text not null,
  sort_order int not null default 0
);

create table subcategories (
  slug text not null,
  category_slug text not null references categories (slug) on delete cascade,
  name text not null,
  description text not null,
  sort_order int not null default 0,
  primary key (category_slug, slug)
);

create table brands (
  slug text primary key,
  name text not null,
  logo_url text
);

create table products (
  slug text primary key,
  name text not null,
  category_slug text not null references categories (slug),
  subcategory_slug text not null,
  short_description text not null,
  description text not null,
  features jsonb not null default '[]',
  specifications jsonb not null default '[]',
  price numeric,
  price_unit text,
  stock_status text not null check (stock_status in ('in_stock', 'made_to_order', 'out_of_stock')),
  installation_available boolean not null default false,
  brand_slug text references brands (slug),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (category_slug, subcategory_slug) references subcategories (category_slug, slug)
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null references products (slug) on delete cascade,
  url text not null,
  alt text not null,
  sort_order int not null default 0
);

create table product_related (
  product_slug text not null references products (slug) on delete cascade,
  related_slug text not null references products (slug) on delete cascade,
  primary key (product_slug, related_slug)
);

create table services (
  slug text primary key,
  name text not null,
  short_description text not null,
  description text not null,
  hero_image_url text not null,
  hero_image_alt text not null,
  benefits jsonb not null default '[]',
  process jsonb not null default '[]',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table service_gallery (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null references services (slug) on delete cascade,
  url text not null,
  alt text not null,
  sort_order int not null default 0
);

create table projects (
  slug text primary key,
  title text not null,
  category text not null check (category in ('residential', 'commercial', 'office', 'hospitality', 'retail')),
  location text not null,
  description text not null,
  services_provided jsonb not null default '[]',
  materials_used jsonb not null default '[]',
  before_image_url text not null,
  before_image_alt text not null,
  completed_date date not null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null references projects (slug) on delete cascade,
  url text not null,
  alt text not null,
  sort_order int not null default 0
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  company text,
  quote text not null,
  rating int not null check (rating between 1 and 5),
  image_url text not null,
  image_alt text not null,
  published boolean not null default true,
  sort_order int not null default 0
);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order int not null default 0
);

create table blog_posts (
  slug text primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  tags jsonb not null default '[]',
  cover_image_url text not null,
  cover_image_alt text not null,
  author text not null,
  seo_description text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text not null,
  image_url text not null,
  image_alt text not null,
  sort_order int not null default 0
);

create table business_info (
  id int primary key default 1 check (id = 1),
  legal_name text not null,
  tagline text not null,
  phones jsonb not null default '[]',
  whatsapp_number text not null,
  email text not null,
  address jsonb not null,
  hours jsonb not null default '[]',
  socials jsonb not null default '{}',
  map_embed_url text,
  service_areas jsonb not null default '[]'
);

-- Lead capture tables (Quote Request, Contact, Bulk Purchase, Contractor &
-- Supplier Registration forms all write here).
create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  location text not null,
  interest text not null,
  quantity text,
  message text,
  created_at timestamptz not null default now()
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table bulk_purchase_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  phone text not null,
  email text not null,
  products_needed text not null,
  estimated_quantity text not null,
  location text not null,
  created_at timestamptz not null default now()
);

create table contractor_registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  phone text not null,
  email text not null,
  specialization text not null,
  years_experience text not null,
  created_at timestamptz not null default now()
);

create table supplier_registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  phone text not null,
  email text not null,
  products_supplied text not null,
  created_at timestamptz not null default now()
);

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create table whatsapp_click_events (
  id uuid primary key default gen_random_uuid(),
  source_page text not null,
  context text,
  created_at timestamptz not null default now()
);

-- Row Level Security: public read on catalogue/content tables, no public
-- access to lead tables (writes go through server-side service role only).
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table brands enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_related enable row level security;
alter table services enable row level security;
alter table service_gallery enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table blog_posts enable row level security;
alter table team_members enable row level security;
alter table business_info enable row level security;

create policy "Public read access" on categories for select using (true);
create policy "Public read access" on subcategories for select using (true);
create policy "Public read access" on brands for select using (true);
create policy "Public read access" on products for select using (true);
create policy "Public read access" on product_images for select using (true);
create policy "Public read access" on product_related for select using (true);
create policy "Public read access" on services for select using (true);
create policy "Public read access" on service_gallery for select using (true);
create policy "Public read access" on projects for select using (true);
create policy "Public read access" on project_images for select using (true);
create policy "Public read access" on testimonials for select using (published = true);
create policy "Public read access" on faqs for select using (true);
create policy "Public read access" on blog_posts for select using (status = 'published');
create policy "Public read access" on team_members for select using (true);
create policy "Public read access" on business_info for select using (true);

-- Lead + analytics tables: RLS enabled with no public policies. Admin
-- dashboard (Phase 2) reads/writes via an authenticated Supabase role.
alter table quote_requests enable row level security;
alter table contact_messages enable row level security;
alter table bulk_purchase_inquiries enable row level security;
alter table contractor_registrations enable row level security;
alter table supplier_registrations enable row level security;
alter table newsletter_subscribers enable row level security;
alter table whatsapp_click_events enable row level security;
