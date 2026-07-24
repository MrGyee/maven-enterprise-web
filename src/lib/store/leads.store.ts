import { readJsonFile, writeJsonFile, generateId } from "./json-file";
import type {
  BulkPurchaseFormValues,
  ContactFormValues,
  ContractorRegistrationValues,
  QuoteFormValues,
  SupplierRegistrationValues,
} from "@/lib/validation/forms";

const file = "leads.json";

interface WithMeta {
  id: string;
  createdAt: string;
}

export type QuoteRequestRecord = QuoteFormValues & WithMeta;
export type ContactMessageRecord = ContactFormValues & WithMeta;
export type BulkPurchaseInquiryRecord = BulkPurchaseFormValues & WithMeta;
export type ContractorRegistrationRecord = ContractorRegistrationValues & WithMeta;
export type SupplierRegistrationRecord = SupplierRegistrationValues & WithMeta;
export type NewsletterSubscriberRecord = { email: string } & WithMeta;

interface LeadsData {
  quoteRequests: QuoteRequestRecord[];
  contactMessages: ContactMessageRecord[];
  bulkPurchaseInquiries: BulkPurchaseInquiryRecord[];
  contractorRegistrations: ContractorRegistrationRecord[];
  supplierRegistrations: SupplierRegistrationRecord[];
  newsletterSubscribers: NewsletterSubscriberRecord[];
}

const fallback: LeadsData = {
  quoteRequests: [],
  contactMessages: [],
  bulkPurchaseInquiries: [],
  contractorRegistrations: [],
  supplierRegistrations: [],
  newsletterSubscribers: [],
};

function readAll(): LeadsData {
  return readJsonFile<LeadsData>(file, fallback);
}

function appendTo<K extends keyof LeadsData>(
  key: K,
  record: LeadsData[K][number]
) {
  const all = readAll();
  (all[key] as LeadsData[K][number][]).unshift(record);
  writeJsonFile(file, all);
}

function withMeta<T extends object>(values: T): T & WithMeta {
  return { ...values, id: generateId(), createdAt: new Date().toISOString() };
}

export const leadsStore = {
  getAll: readAll,
  addQuoteRequest(values: QuoteFormValues) {
    const record = withMeta(values);
    appendTo("quoteRequests", record);
    return record;
  },
  addContactMessage(values: ContactFormValues) {
    const record = withMeta(values);
    appendTo("contactMessages", record);
    return record;
  },
  addBulkPurchaseInquiry(values: BulkPurchaseFormValues) {
    const record = withMeta(values);
    appendTo("bulkPurchaseInquiries", record);
    return record;
  },
  addContractorRegistration(values: ContractorRegistrationValues) {
    const record = withMeta(values);
    appendTo("contractorRegistrations", record);
    return record;
  },
  addSupplierRegistration(values: SupplierRegistrationValues) {
    const record = withMeta(values);
    appendTo("supplierRegistrations", record);
    return record;
  },
  addNewsletterSubscriber(email: string) {
    const record = withMeta({ email });
    appendTo("newsletterSubscribers", record);
    return record;
  },
};
