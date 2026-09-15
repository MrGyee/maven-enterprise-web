import { z } from "zod";

const name = z.string().trim().min(2, "Please enter your full name.");
const phone = z
  .string()
  .trim()
  .min(9, "Please enter a valid phone number.")
  .max(20, "Please enter a valid phone number.");
const email = z.string().trim().email("Please enter a valid email address.");
const message = z.string().trim().max(2000).optional().or(z.literal(""));

export const quoteFormSchema = z.object({
  name,
  phone,
  email,
  location: z.string().trim().min(2, "Please tell us your location."),
  interest: z.string().trim().min(2, "Please tell us what you need a quote for."),
  quantity: z.string().trim().optional().or(z.literal("")),
  message,
});
export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const contactFormSchema = z.object({
  name,
  email,
  phone,
  subject: z.string().trim().min(2, "Please enter a subject."),
  message: z.string().trim().min(10, "Please enter a message of at least 10 characters."),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const bulkPurchaseFormSchema = z.object({
  name,
  company: z.string().trim().min(2, "Please enter your company name."),
  phone,
  email,
  productsNeeded: z.string().trim().min(2, "Please describe the products you need."),
  estimatedQuantity: z.string().trim().min(1, "Please provide an estimated quantity."),
  location: z.string().trim().min(2, "Please tell us your location."),
});
export type BulkPurchaseFormValues = z.infer<typeof bulkPurchaseFormSchema>;

export const contractorRegistrationSchema = z.object({
  name,
  company: z.string().trim().min(2, "Please enter your company name."),
  phone,
  email,
  specialization: z.string().trim().min(2, "Please describe your specialization."),
  yearsExperience: z.string().trim().min(1, "Please enter your years of experience."),
});
export type ContractorRegistrationValues = z.infer<typeof contractorRegistrationSchema>;

export const newsletterSchema = z.object({
  email,
});
export type NewsletterValues = z.infer<typeof newsletterSchema>;

export const supplierRegistrationSchema = z.object({
  name,
  company: z.string().trim().min(2, "Please enter your company name."),
  phone,
  email,
  productsSupplied: z.string().trim().min(2, "Please describe the products you supply."),
});
export type SupplierRegistrationValues = z.infer<typeof supplierRegistrationSchema>;

// Project Quote cart (src/lib/cart/) ----------------------------------------

export const projectQuoteItemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  image: z.string().optional(),
  priceUnit: z.string().optional(),
  price: z.number().optional(),
  // Not .int() — calculator-derived quantities are fractional for
  // continuously-priced products (e.g. 15.4 m² of flooring).
  quantity: z.number().positive(),
});
export type ProjectQuoteItem = z.infer<typeof projectQuoteItemSchema>;

export const projectQuoteRequestSchema = z.object({
  name,
  company: z.string().trim().optional().or(z.literal("")),
  phone,
  email,
  items: z.array(projectQuoteItemSchema).min(1, "Add at least one product to your quote."),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});
export type ProjectQuoteRequestValues = z.infer<typeof projectQuoteRequestSchema>;

// BOQ / project procurement submission (src/app/(site)/boq/) ---------------

export const boqEnquiryTypes = [
  "Product quotation",
  "Full project quotation",
  "BOQ pricing",
  "Installation",
  "Design consultation",
  "Bulk/contractor pricing",
] as const;

export const boqProjectTypes = [
  "Residential",
  "Apartment Development",
  "Office",
  "Hotel / Hospitality",
  "Retail",
  "School / Institution",
  "Commercial",
  "Other",
] as const;

export const boqProjectStatuses = [
  "Planning",
  "Design stage",
  "Ready for procurement",
  "Construction underway",
  "Renovation underway",
] as const;

export const boqRequirements = ["Supply", "Installation", "Both", "Product alternatives", "Quantity review"] as const;

export const boqFileSchema = z.object({
  url: z.string(),
  publicId: z.string(),
  resourceType: z.string(),
  originalName: z.string(),
  format: z.string().optional(),
  bytes: z.number().optional(),
});
export type BoqFile = z.infer<typeof boqFileSchema>;

export const boqSubmissionSchema = z.object({
  enquiryType: z.enum(boqEnquiryTypes),
  projectType: z.enum(boqProjectTypes),
  county: z.string().trim().optional().or(z.literal("")),
  area: z.string().trim().optional().or(z.literal("")),
  siteLocation: z.string().trim().optional().or(z.literal("")),
  projectStatus: z.enum(boqProjectStatuses),
  requirements: z.array(z.enum(boqRequirements)).min(1, "Select at least one requirement."),
  files: z.array(boqFileSchema),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  name,
  company: z.string().trim().optional().or(z.literal("")),
  phone,
  email,
  preferredContact: z.enum(["phone", "whatsapp", "email"]),
});
export type BoqSubmissionValues = z.infer<typeof boqSubmissionSchema>;

// Maven Trade registration (src/app/(site)/trade/register/) ----------------

export const tradeBusinessTypes = [
  "Contractor",
  "Developer",
  "Architect",
  "Interior Designer",
  "Quantity Surveyor",
  "Project Manager",
  "Commercial Property",
  "Other",
] as const;

export const tradeApplicationSchema = z.object({
  companyName: z.string().trim().min(2, "Please enter your company name."),
  contactPerson: name,
  phone,
  email,
  businessType: z.enum(tradeBusinessTypes),
  yearsInBusiness: z.string().trim().optional().or(z.literal("")),
  projectLocations: z.string().trim().optional().or(z.literal("")),
  typicalProjectSize: z.string().trim().optional().or(z.literal("")),
  productsOfInterest: z.string().trim().optional().or(z.literal("")),
});
export type TradeApplicationValues = z.infer<typeof tradeApplicationSchema>;
