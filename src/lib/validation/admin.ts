import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

const imageAsset = z.object({
  url: z.string().min(1, "Image is required"),
  alt: z.string().trim().min(1, "Alt text is required"),
});

export const subcategorySchema = z.object({
  slug,
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export const categoryAdminSchema = z.object({
  slug,
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  heroImage: imageAsset,
  subcategories: z.array(subcategorySchema).min(1, "Add at least one subcategory"),
});
export type CategoryAdminValues = z.infer<typeof categoryAdminSchema>;

export const productAdminSchema = z.object({
  slug,
  name: z.string().trim().min(1, "Name is required"),
  categorySlug: z.string().trim().min(1, "Category is required"),
  subcategorySlug: z.string().trim().min(1, "Subcategory is required"),
  shortDescription: z.string().trim().min(1, "Short description is required"),
  description: z.string().trim().min(1, "Description is required"),
  images: z.array(imageAsset),
  features: z.array(z.string().trim().min(1)),
  specifications: z.array(
    z.object({ label: z.string().trim().min(1), value: z.string().trim().min(1) })
  ),
  price: z.number().positive().optional(),
  priceUnit: z.string().trim().optional(),
  stockStatus: z.enum(["in_stock", "made_to_order", "out_of_stock"]),
  installationAvailable: z.boolean(),
  featured: z.boolean(),
});
export type ProductAdminValues = z.infer<typeof productAdminSchema>;

export const serviceAdminSchema = z.object({
  slug,
  name: z.string().trim().min(1, "Name is required"),
  shortDescription: z.string().trim().min(1, "Short description is required"),
  description: z.string().trim().min(1, "Description is required"),
  heroImage: imageAsset,
  benefits: z.array(z.string().trim().min(1)),
  gallery: z.array(imageAsset),
  process: z.array(
    z.object({ title: z.string().trim().min(1), description: z.string().trim().min(1) })
  ),
  featured: z.boolean(),
});
export type ServiceAdminValues = z.infer<typeof serviceAdminSchema>;

export const projectAdminSchema = z.object({
  slug,
  title: z.string().trim().min(1, "Title is required"),
  category: z.enum(["residential", "commercial", "office", "hospitality", "retail"]),
  location: z.string().trim().min(1, "Location is required"),
  description: z.string().trim().min(1, "Description is required"),
  servicesProvided: z.array(z.string().trim().min(1)),
  materialsUsed: z.array(z.string().trim().min(1)),
  beforeImage: imageAsset,
  afterImages: z.array(imageAsset).min(1, "Add at least one after image"),
  completedDate: z.string().trim().min(1, "Completion date is required"),
  featured: z.boolean(),
});
export type ProjectAdminValues = z.infer<typeof projectAdminSchema>;

export const testimonialAdminSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1, "Name is required"),
  role: z.string().trim().min(1, "Role is required"),
  company: z.string().trim().optional(),
  quote: z.string().trim().min(1, "Quote is required"),
  rating: z.number().min(1).max(5),
  image: imageAsset,
});
export type TestimonialAdminValues = z.infer<typeof testimonialAdminSchema>;

export const faqAdminSchema = z.object({
  id: z.string().trim().min(1),
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  category: z.string().trim().optional(),
});
export type FaqAdminValues = z.infer<typeof faqAdminSchema>;

export const brandAdminSchema = z.object({
  slug,
  name: z.string().trim().min(1, "Name is required"),
});
export type BrandAdminValues = z.infer<typeof brandAdminSchema>;

export const teamMemberAdminSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1, "Name is required"),
  role: z.string().trim().min(1, "Role is required"),
  bio: z.string().trim().min(1, "Bio is required"),
  image: imageAsset,
});
export type TeamMemberAdminValues = z.infer<typeof teamMemberAdminSchema>;

export const blogPostAdminSchema = z.object({
  slug,
  title: z.string().trim().min(1, "Title is required"),
  excerpt: z.string().trim().min(1, "Excerpt is required"),
  content: z.string().trim().min(1, "Content is required"),
  category: z.string().trim().min(1, "Category is required"),
  tags: z.array(z.string().trim().min(1)),
  coverImage: imageAsset,
  author: z.string().trim().min(1, "Author is required"),
  publishedAt: z.string().trim().min(1, "Publish date is required"),
  readTimeMinutes: z.number().min(1),
  seoDescription: z.string().trim().min(1, "SEO description is required"),
  status: z.enum(["draft", "published"]),
});
export type BlogPostAdminValues = z.infer<typeof blogPostAdminSchema>;
