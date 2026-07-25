import type {
  BulkPurchaseFormValues,
  ContactFormValues,
  ContractorRegistrationValues,
  NewsletterValues,
  QuoteFormValues,
  SupplierRegistrationValues,
} from "@/lib/validation/forms";
import { leadsStore } from "@/lib/store/leads.store";

// TODO: also send an email notification to the administrator when a lead
// comes in. Persistence goes through Supabase so leads show up in
// /admin/leads.
export async function saveQuoteRequest(values: QuoteFormValues) {
  await leadsStore.addQuoteRequest(values);
}

export async function saveContactMessage(values: ContactFormValues) {
  await leadsStore.addContactMessage(values);
}

export async function saveBulkPurchaseInquiry(values: BulkPurchaseFormValues) {
  await leadsStore.addBulkPurchaseInquiry(values);
}

export async function saveContractorRegistration(values: ContractorRegistrationValues) {
  await leadsStore.addContractorRegistration(values);
}

export async function saveSupplierRegistration(values: SupplierRegistrationValues) {
  await leadsStore.addSupplierRegistration(values);
}

export async function saveNewsletterSubscriber(values: NewsletterValues) {
  await leadsStore.addNewsletterSubscriber(values.email);
}
