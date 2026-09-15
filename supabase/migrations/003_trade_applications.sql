-- Maven Enterprise Ltd — Migration 003: Maven Trade applications
--
-- Run in the Supabase SQL Editor after 002_boq_and_project_quotes.sql.
-- Same conventions as the rest of the schema: RLS enabled, no policies
-- (service_role-only access).

create table trade_applications (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  company_name text not null,
  contact_person text not null,
  phone text not null,
  email text not null,
  business_type text not null,
  years_in_business text,
  project_locations text,
  typical_project_size text,
  products_of_interest text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz not null default now()
);

alter table trade_applications enable row level security;
