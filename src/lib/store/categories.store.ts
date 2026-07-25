import { createSupabaseCollectionStore } from "./supabase-collection";
import type { Category, Subcategory } from "@/lib/data/types";

interface CategoryRow {
  slug: string;
  name: string;
  description: string;
  hero_image_url: string;
  hero_image_alt: string;
  subcategories: Subcategory[];
}

function toDomain(row: CategoryRow): Category {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    heroImage: { url: row.hero_image_url, alt: row.hero_image_alt },
    subcategories: row.subcategories,
  };
}

function toRow(c: Category): CategoryRow {
  return {
    slug: c.slug,
    name: c.name,
    description: c.description,
    hero_image_url: c.heroImage.url,
    hero_image_alt: c.heroImage.alt,
    subcategories: c.subcategories,
  };
}

export const categoriesStore = createSupabaseCollectionStore<CategoryRow, Category>(
  "categories",
  "slug",
  toDomain,
  toRow
);
