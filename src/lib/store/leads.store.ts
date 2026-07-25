import { getSupabaseClient } from "@/lib/supabase/server-client";
import type {
  BulkPurchaseFormValues,
  ContactFormValues,
  ContractorRegistrationValues,
  QuoteFormValues,
  SupplierRegistrationValues,
} from "@/lib/validation/forms";

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

function rowToMeta(row: { id: string; created_at: string }): WithMeta {
  return { id: row.id, createdAt: row.created_at };
}

interface QuoteRequestRow {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  interest: string;
  quantity: string | null;
  message: string | null;
}

interface ContactMessageRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface BulkPurchaseInquiryRow {
  id: string;
  created_at: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  products_needed: string;
  estimated_quantity: string;
  location: string;
}

interface ContractorRegistrationRow {
  id: string;
  created_at: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  specialization: string;
  years_experience: string;
}

interface SupplierRegistrationRow {
  id: string;
  created_at: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  products_supplied: string;
}

interface NewsletterSubscriberRow {
  id: string;
  created_at: string;
  email: string;
}

async function selectAll<Row, T>(table: string, mapRow: (row: Row) => T): Promise<T[]> {
  const { data, error } = await getSupabaseClient()
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`[${table}] select: ${error.message}`);
  return ((data ?? []) as Row[]).map(mapRow);
}

async function insertOne<Row, T>(table: string, row: Record<string, unknown>, mapRow: (row: Row) => T): Promise<T> {
  // `table` is a runtime string, not a literal type, so with no generated
  // Database schema type, insert() can't infer this table's row shape and
  // resolves its payload param to `never`. The Row/T generics above already
  // give us real type safety; cast the builder past that gap.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getSupabaseClient().from(table) as any).insert(row).select().single();
  if (error) throw new Error(`[${table}] insert: ${error.message}`);
  return mapRow(data as Row);
}

const mapQuoteRequest = (row: QuoteRequestRow): QuoteRequestRecord => ({
  ...rowToMeta(row),
  name: row.name,
  phone: row.phone,
  email: row.email,
  location: row.location,
  interest: row.interest,
  quantity: row.quantity ?? "",
  message: row.message ?? "",
});

const mapContactMessage = (row: ContactMessageRow): ContactMessageRecord => ({
  ...rowToMeta(row),
  name: row.name,
  email: row.email,
  phone: row.phone,
  subject: row.subject,
  message: row.message,
});

const mapBulkPurchase = (row: BulkPurchaseInquiryRow): BulkPurchaseInquiryRecord => ({
  ...rowToMeta(row),
  name: row.name,
  company: row.company,
  phone: row.phone,
  email: row.email,
  productsNeeded: row.products_needed,
  estimatedQuantity: row.estimated_quantity,
  location: row.location,
});

const mapContractorRegistration = (row: ContractorRegistrationRow): ContractorRegistrationRecord => ({
  ...rowToMeta(row),
  name: row.name,
  company: row.company,
  phone: row.phone,
  email: row.email,
  specialization: row.specialization,
  yearsExperience: row.years_experience,
});

const mapSupplierRegistration = (row: SupplierRegistrationRow): SupplierRegistrationRecord => ({
  ...rowToMeta(row),
  name: row.name,
  company: row.company,
  phone: row.phone,
  email: row.email,
  productsSupplied: row.products_supplied,
});

const mapNewsletterSubscriber = (row: NewsletterSubscriberRow): NewsletterSubscriberRecord => ({
  ...rowToMeta(row),
  email: row.email,
});

export const leadsStore = {
  async getAll(): Promise<LeadsData> {
    const [
      quoteRequests,
      contactMessages,
      bulkPurchaseInquiries,
      contractorRegistrations,
      supplierRegistrations,
      newsletterSubscribers,
    ] = await Promise.all([
      selectAll("quote_requests", mapQuoteRequest),
      selectAll("contact_messages", mapContactMessage),
      selectAll("bulk_purchase_inquiries", mapBulkPurchase),
      selectAll("contractor_registrations", mapContractorRegistration),
      selectAll("supplier_registrations", mapSupplierRegistration),
      selectAll("newsletter_subscribers", mapNewsletterSubscriber),
    ]);
    return {
      quoteRequests,
      contactMessages,
      bulkPurchaseInquiries,
      contractorRegistrations,
      supplierRegistrations,
      newsletterSubscribers,
    };
  },

  addQuoteRequest(values: QuoteFormValues) {
    return insertOne("quote_requests", values, mapQuoteRequest);
  },
  addContactMessage(values: ContactFormValues) {
    return insertOne("contact_messages", values, mapContactMessage);
  },
  addBulkPurchaseInquiry(values: BulkPurchaseFormValues) {
    return insertOne(
      "bulk_purchase_inquiries",
      {
        name: values.name,
        company: values.company,
        phone: values.phone,
        email: values.email,
        products_needed: values.productsNeeded,
        estimated_quantity: values.estimatedQuantity,
        location: values.location,
      },
      mapBulkPurchase
    );
  },
  addContractorRegistration(values: ContractorRegistrationValues) {
    return insertOne(
      "contractor_registrations",
      {
        name: values.name,
        company: values.company,
        phone: values.phone,
        email: values.email,
        specialization: values.specialization,
        years_experience: values.yearsExperience,
      },
      mapContractorRegistration
    );
  },
  addSupplierRegistration(values: SupplierRegistrationValues) {
    return insertOne(
      "supplier_registrations",
      {
        name: values.name,
        company: values.company,
        phone: values.phone,
        email: values.email,
        products_supplied: values.productsSupplied,
      },
      mapSupplierRegistration
    );
  },
  addNewsletterSubscriber(email: string) {
    return insertOne("newsletter_subscribers", { email }, mapNewsletterSubscriber);
  },
};
