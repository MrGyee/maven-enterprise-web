/**
 * One-time seed: loads the legacy data/*.json content into a fresh Supabase
 * database (see supabase/schema.sql). Run once after creating the schema,
 * against an empty database — slug-keyed tables will fail on a unique
 * violation if run twice, and uuid-keyed tables (testimonials, faqs, team,
 * hero banners) would insert duplicates since new ids are generated per run.
 *
 * Usage (from maven-web/):
 *   npx tsx --env-file=.env.local scripts/seed-supabase.ts
 *
 * Does not import src/lib/supabase/server-client.ts because that file pulls
 * in `server-only`, which throws when required outside a Next.js server
 * bundle (this runs as a plain Node script via tsx).
 */
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { BusinessInfo, Category, Product, Service, Project, BlogPost, Testimonial, Faq, TeamMember, Brand } from "../src/lib/data/types";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. Run with:\n" +
      "  npx tsx --env-file=.env.local scripts/seed-supabase.ts"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const dataDir = path.join(__dirname, "..", "data");

function loadJson<T>(file: string): T {
  return JSON.parse(readFileSync(path.join(dataDir, file), "utf8")) as T;
}

async function insertRows(table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see supabase-collection.ts: no generated Database type for a dynamic table name.
  const { error } = await (supabase.from(table) as any).insert(rows);
  if (error) throw new Error(`[${table}] insert failed: ${error.message}`);
  console.log(`  ${table}: inserted ${rows.length} row(s)`);
}

async function seedCategories() {
  const categories = loadJson<Category[]>("categories.json");
  await insertRows(
    "categories",
    categories.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      hero_image_url: c.heroImage.url,
      hero_image_alt: c.heroImage.alt,
      subcategories: c.subcategories,
    }))
  );
}

async function seedBrands() {
  const brands = loadJson<Brand[]>("brands.json");
  await insertRows("brands", brands.map((b) => ({ slug: b.slug, name: b.name })));
}

async function seedProducts() {
  const products = loadJson<Product[]>("products.json");
  await insertRows(
    "products",
    products.map((p) => ({
      slug: p.slug,
      name: p.name,
      category_slug: p.categorySlug,
      subcategory_slug: p.subcategorySlug,
      short_description: p.shortDescription,
      description: p.description,
      images: p.images,
      features: p.features,
      specifications: p.specifications,
      price: p.price ?? null,
      price_unit: p.priceUnit ?? null,
      stock_status: p.stockStatus,
      installation_available: p.installationAvailable,
      brand_slug: p.brandSlug ?? null,
      related_slugs: p.relatedSlugs,
      featured: p.featured ?? false,
    }))
  );
}

async function seedServices() {
  const services = loadJson<Service[]>("services.json");
  await insertRows(
    "services",
    services.map((s) => ({
      slug: s.slug,
      name: s.name,
      short_description: s.shortDescription,
      description: s.description,
      hero_image_url: s.heroImage.url,
      hero_image_alt: s.heroImage.alt,
      benefits: s.benefits,
      gallery: s.gallery,
      process: s.process,
      featured: s.featured ?? false,
    }))
  );
}

async function seedProjects() {
  const projects = loadJson<Project[]>("projects.json");
  await insertRows(
    "projects",
    projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      location: p.location,
      description: p.description,
      services_provided: p.servicesProvided,
      materials_used: p.materialsUsed,
      before_image_url: p.beforeImage.url,
      before_image_alt: p.beforeImage.alt,
      after_images: p.afterImages,
      completed_date: p.completedDate,
      featured: p.featured ?? false,
    }))
  );
}

async function seedBlogPosts() {
  const posts = loadJson<BlogPost[]>("blog.json");
  await insertRows(
    "blog_posts",
    posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      tags: p.tags,
      cover_image_url: p.coverImage.url,
      cover_image_alt: p.coverImage.alt,
      author: p.author,
      published_at: p.publishedAt,
      read_time_minutes: p.readTimeMinutes,
      seo_description: p.seoDescription,
      status: p.status,
    }))
  );
}

async function seedTestimonials() {
  const testimonials = loadJson<Testimonial[]>("testimonials.json");
  await insertRows(
    "testimonials",
    testimonials.map((t) => ({
      id: randomUUID(),
      name: t.name,
      role: t.role,
      company: t.company ?? null,
      quote: t.quote,
      rating: t.rating,
      image_url: t.image.url,
      image_alt: t.image.alt,
    }))
  );
}

async function seedFaqs() {
  const faqs = loadJson<Faq[]>("faqs.json");
  await insertRows(
    "faqs",
    faqs.map((f) => ({
      id: randomUUID(),
      question: f.question,
      answer: f.answer,
      category: f.category ?? null,
    }))
  );
}

async function seedTeam() {
  const team = loadJson<TeamMember[]>("team.json");
  await insertRows(
    "team_members",
    team.map((m) => ({
      id: randomUUID(),
      name: m.name,
      role: m.role,
      bio: m.bio,
      image_url: m.image.url,
      image_alt: m.image.alt,
    }))
  );
}

async function seedHeroBanners() {
  const banners = loadJson<{ id: string; url: string; alt: string; sortOrder: number }[]>("hero-banners.json");
  await insertRows(
    "hero_banners",
    banners.map((b) => ({
      id: randomUUID(),
      url: b.url,
      alt: b.alt,
      sort_order: b.sortOrder,
    }))
  );
}

async function seedBusinessInfo() {
  const info = loadJson<BusinessInfo>("business-info.json");
  await insertRows("business_info", [
    {
      id: 1,
      legal_name: info.legalName,
      tagline: info.tagline,
      phones: info.phones,
      whatsapp_number: info.whatsappNumber,
      email: info.email,
      address: info.address,
      hours: info.hours,
      socials: info.socials,
      map_embed_url: info.mapEmbedUrl,
      coordinates: info.coordinates,
      service_areas: info.serviceAreas,
    },
  ]);
}

async function main() {
  console.log(`Seeding ${url} from data/*.json ...\n`);
  await seedCategories();
  await seedBrands();
  await seedProducts();
  await seedServices();
  await seedProjects();
  await seedBlogPosts();
  await seedTestimonials();
  await seedFaqs();
  await seedTeam();
  await seedHeroBanners();
  await seedBusinessInfo();
  console.log("\nDone.");
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message);
  process.exit(1);
});
