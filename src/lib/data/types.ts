export interface ImageAsset {
  url: string;
  alt: string;
}

export interface Subcategory {
  slug: string;
  name: string;
  description: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  heroImage: ImageAsset;
  subcategories: Subcategory[];
}

export type StockStatus = "in_stock" | "made_to_order" | "out_of_stock";

export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  categorySlug: string;
  subcategorySlug: string;
  shortDescription: string;
  description: string;
  images: ImageAsset[];
  features: string[];
  specifications: Specification[];
  price?: number;
  priceUnit?: string;
  stockStatus: StockStatus;
  installationAvailable: boolean;
  brandSlug?: string;
  relatedSlugs: string[];
  featured?: boolean;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  heroImage: ImageAsset;
  benefits: string[];
  gallery: ImageAsset[];
  process: ProcessStep[];
  featured?: boolean;
}

export type ProjectCategory =
  | "residential"
  | "commercial"
  | "office"
  | "hospitality"
  | "retail";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  location: string;
  description: string;
  servicesProvided: string[];
  materialsUsed: string[];
  beforeImage: ImageAsset;
  afterImages: ImageAsset[];
  completedDate: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  quote: string;
  rating: number;
  image: ImageAsset;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export type BlogStatus = "draft" | "published";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: ImageAsset;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  seoDescription: string;
  status: BlogStatus;
}

export interface Brand {
  slug: string;
  name: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: ImageAsset;
}

export interface BusinessHours {
  days: string;
  time: string;
}

export interface BusinessInfo {
  legalName: string;
  tagline: string;
  phones: string[];
  whatsappNumber: string;
  email: string;
  address: {
    street: string;
    area: string;
    city: string;
    country: string;
  };
  hours: BusinessHours[];
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    tiktok: string;
  };
  mapEmbedUrl: string;
  coordinates: { lat: number; lng: number };
  serviceAreas: string[];
}
