import { createSupabaseCollectionStore } from "./supabase-collection";
import type { Service, ImageAsset, ProcessStep } from "@/lib/data/types";

interface ServiceRow {
  slug: string;
  name: string;
  short_description: string;
  description: string;
  hero_image_url: string;
  hero_image_alt: string;
  benefits: string[];
  gallery: ImageAsset[];
  process: ProcessStep[];
  featured: boolean;
}

function toDomain(row: ServiceRow): Service {
  return {
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    heroImage: { url: row.hero_image_url, alt: row.hero_image_alt },
    benefits: row.benefits,
    gallery: row.gallery,
    process: row.process,
    featured: row.featured,
  };
}

function toRow(s: Service): ServiceRow {
  return {
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
  };
}

export const servicesStore = createSupabaseCollectionStore<ServiceRow, Service>(
  "services",
  "slug",
  toDomain,
  toRow
);
