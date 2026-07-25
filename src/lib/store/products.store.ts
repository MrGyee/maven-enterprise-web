import { createSupabaseCollectionStore } from "./supabase-collection";
import type { Product, ImageAsset, Specification, StockStatus } from "@/lib/data/types";

interface ProductRow {
  slug: string;
  name: string;
  category_slug: string;
  subcategory_slug: string;
  short_description: string;
  description: string;
  images: ImageAsset[];
  features: string[];
  specifications: Specification[];
  price: number | null;
  price_unit: string | null;
  stock_status: StockStatus;
  installation_available: boolean;
  brand_slug: string | null;
  related_slugs: string[];
  featured: boolean;
}

function toDomain(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    categorySlug: row.category_slug,
    subcategorySlug: row.subcategory_slug,
    shortDescription: row.short_description,
    description: row.description,
    images: row.images,
    features: row.features,
    specifications: row.specifications,
    price: row.price ?? undefined,
    priceUnit: row.price_unit ?? undefined,
    stockStatus: row.stock_status,
    installationAvailable: row.installation_available,
    brandSlug: row.brand_slug ?? undefined,
    relatedSlugs: row.related_slugs,
    featured: row.featured,
  };
}

function toRow(p: Product): ProductRow {
  return {
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
  };
}

export const productsStore = createSupabaseCollectionStore<ProductRow, Product>(
  "products",
  "slug",
  toDomain,
  toRow
);
