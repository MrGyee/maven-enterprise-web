import { createSupabaseCollectionStore } from "./supabase-collection";
import type { BlogPost, BlogStatus } from "@/lib/data/types";

interface BlogPostRow {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  cover_image_url: string;
  cover_image_alt: string;
  author: string;
  published_at: string;
  read_time_minutes: number;
  seo_description: string;
  status: BlogStatus;
}

function toDomain(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tags: row.tags,
    coverImage: { url: row.cover_image_url, alt: row.cover_image_alt },
    author: row.author,
    publishedAt: row.published_at,
    readTimeMinutes: row.read_time_minutes,
    seoDescription: row.seo_description,
    status: row.status,
  };
}

function toRow(p: BlogPost): BlogPostRow {
  return {
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
  };
}

export const blogStore = createSupabaseCollectionStore<BlogPostRow, BlogPost>(
  "blog_posts",
  "slug",
  toDomain,
  toRow
);
