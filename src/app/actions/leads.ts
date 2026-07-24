"use server";

import {
  bulkPurchaseFormSchema,
  contactFormSchema,
  contractorRegistrationSchema,
  newsletterSchema,
  quoteFormSchema,
  supplierRegistrationSchema,
} from "@/lib/validation/forms";
import {
  saveBulkPurchaseInquiry,
  saveContactMessage,
  saveContractorRegistration,
  saveNewsletterSubscriber,
  saveQuoteRequest,
  saveSupplierRegistration,
} from "@/lib/data/leads";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function submitQuoteRequest(
  raw: Record<string, string>
): Promise<ActionResult> {
  const parsed = quoteFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await saveQuoteRequest(parsed.data);
  return { success: true };
}

export async function submitContactMessage(
  raw: Record<string, string>
): Promise<ActionResult> {
  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await saveContactMessage(parsed.data);
  return { success: true };
}

export async function submitBulkPurchaseInquiry(
  raw: Record<string, string>
): Promise<ActionResult> {
  const parsed = bulkPurchaseFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await saveBulkPurchaseInquiry(parsed.data);
  return { success: true };
}

export async function submitContractorRegistration(
  raw: Record<string, string>
): Promise<ActionResult> {
  const parsed = contractorRegistrationSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await saveContractorRegistration(parsed.data);
  return { success: true };
}

export async function submitNewsletterSignup(
  raw: Record<string, string>
): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await saveNewsletterSubscriber(parsed.data);
  return { success: true };
}

export async function submitSupplierRegistration(
  raw: Record<string, string>
): Promise<ActionResult> {
  const parsed = supplierRegistrationSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await saveSupplierRegistration(parsed.data);
  return { success: true };
}
