import { createSupabaseCollectionStore } from "./supabase-collection";
import type { Project, ImageAsset, ProjectCategory } from "@/lib/data/types";

interface ProjectRow {
  slug: string;
  title: string;
  category: ProjectCategory;
  location: string;
  description: string;
  services_provided: string[];
  materials_used: string[];
  before_image_url: string;
  before_image_alt: string;
  after_images: ImageAsset[];
  completed_date: string;
  featured: boolean;
}

function toDomain(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    location: row.location,
    description: row.description,
    servicesProvided: row.services_provided,
    materialsUsed: row.materials_used,
    beforeImage: { url: row.before_image_url, alt: row.before_image_alt },
    afterImages: row.after_images,
    completedDate: row.completed_date,
    featured: row.featured,
  };
}

function toRow(p: Project): ProjectRow {
  return {
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
  };
}

export const projectsStore = createSupabaseCollectionStore<ProjectRow, Project>(
  "projects",
  "slug",
  toDomain,
  toRow
);
