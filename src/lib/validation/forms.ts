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
