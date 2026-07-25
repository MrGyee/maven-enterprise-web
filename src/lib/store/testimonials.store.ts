import { createSupabaseCollectionStore } from "./supabase-collection";
import type { Testimonial } from "@/lib/data/types";

interface TestimonialRow {
  id: string;
  name: string;
  role: string;
  company: string | null;
  quote: string;
  rating: number;
  image_url: string;
  image_alt: string;
}

function toDomain(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    company: row.company ?? undefined,
    quote: row.quote,
    rating: row.rating,
    image: { url: row.image_url, alt: row.image_alt },
  };
}

function toRow(t: Testimonial): TestimonialRow {
  return {
    id: t.id,
    name: t.name,
    role: t.role,
    company: t.company ?? null,
    quote: t.quote,
    rating: t.rating,
    image_url: t.image.url,
    image_alt: t.image.alt,
  };
}

export const testimonialsStore = createSupabaseCollectionStore<TestimonialRow, Testimonial>(
  "testimonials",
  "id",
  toDomain,
  toRow
);
