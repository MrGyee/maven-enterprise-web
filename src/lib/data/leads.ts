import type {
  BulkPurchaseFormValues,
  ContactFormValues,
  ContractorRegistrationValues,
  NewsletterValues,
  QuoteFormValues,
  SupplierRegistrationValues,
} from "@/lib/validation/forms";
import { leadsStore } from "@/lib/store/leads.store";

// TODO Phase 3: also send an email notification to the administrator when a
// lead comes in. Persistence now goes through the JSON store so leads show
// up in /admin/leads.
export async function saveQuoteRequest(values: QuoteFormValues) {
  leadsStore.addQuoteRequest(values);
}

export async function saveContactMessage(values: ContactFormValues) {
  leadsStore.addContactMessage(values);
}

export async function saveBulkPurchaseInquiry(values: BulkPurchaseFormValues) {
  leadsStore.addBulkPurchaseInquiry(values);
}

export async function saveContractorRegistration(values: ContractorRegistrationValues) {
  leadsStore.addContractorRegistration(values);
}

export async function saveSupplierRegistration(values: SupplierRegistrationValues) {
  leadsStore.addSupplierRegistration(values);
}

export async function saveNewsletterSubscriber(values: NewsletterValues) {
  leadsStore.addNewsletterSubscriber(values.email);
}
