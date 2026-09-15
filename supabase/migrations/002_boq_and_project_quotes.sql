-- Maven Enterprise Ltd — Migration 002: Project Quote cart + BOQ submissions
--
-- Run this once in the Supabase SQL Editor against the same project that
-- already has supabase/schema.sql applied. Same conventions as that file:
-- RLS enabled with no policies (service_role-only access — see
-- src/lib/supabase/server-client.ts), gen_random_uuid() from pgcrypto.

-- Project Quote cart submissions (multi-item "Add to Project Quote" cart,
-- src/lib/cart/) -----------------------------------------------------------

create table project_quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  name text not null,
  company text,
  phone text not null,
  email text not null,
  items jsonb not null default '[]',
  notes text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'quoted', 'closed')),
  created_at timestamptz not null default now()
);

-- BOQ / project procurement submissions (src/app/(site)/boq/) --------------

create table boq_submissions (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  name text not null,
  company text,
  phone text not null,
  email text not null,
  preferred_contact text not null default 'phone' check (preferred_contact in ('phone', 'whatsapp', 'email')),
  enquiry_type text not null,
  project_type text not null,
  county text,
  area text,
  site_location text,
  project_status text not null,
  requirements jsonb not null default '[]',
  files jsonb not null default '[]',
  notes text,
  status text not null default 'new'
    check (status in ('new', 'under_review', 'pricing', 'quote_sent', 'customer_reviewing', 'approved', 'rejected', 'completed')),
  assigned_to text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index boq_submissions_status_idx on boq_submissions (status);

alter table project_quote_requests enable row level security;
alter table boq_submissions enable row level security;
