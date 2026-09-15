import { getSupabaseClient } from "@/lib/supabase/server-client";
import { generateReference } from "@/lib/reference";
import type { TradeApplicationValues } from "@/lib/validation/forms";

export type TradeApplicationStatus = "new" | "reviewing" | "approved" | "rejected";

export interface TradeApplicationRecord {
  id: string;
  reference: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessType: string;
  yearsInBusiness: string | null;
  projectLocations: string | null;
  typicalProjectSize: string | null;
  productsOfInterest: string | null;
  status: TradeApplicationStatus;
  adminNotes: string | null;
  createdAt: string;
}

interface TradeApplicationRow {
  id: string;
  reference: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  business_type: string;
  years_in_business: string | null;
  project_locations: string | null;
  typical_project_size: string | null;
  products_of_interest: string | null;
  status: TradeApplicationStatus;
  admin_notes: string | null;
  created_at: string;
}

function toDomain(row: TradeApplicationRow): TradeApplicationRecord {
  return {
    id: row.id,
    reference: row.reference,
    companyName: row.company_name,
    contactPerson: row.contact_person,
    phone: row.phone,
    email: row.email,
    businessType: row.business_type,
    yearsInBusiness: row.years_in_business,
    projectLocations: row.project_locations,
    typicalProjectSize: row.typical_project_size,
    productsOfInterest: row.products_of_interest,
    status: row.status,
    adminNotes: row.admin_notes,
    createdAt: row.created_at,
  };
}

const TABLE = "trade_applications";
const MAX_INSERT_ATTEMPTS = 3;

export const tradeStore = {
  async getAll(): Promise<TradeApplicationRecord[]> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`[${TABLE}] select: ${error.message}`);
    return ((data ?? []) as TradeApplicationRow[]).map(toDomain);
  },

  async getById(id: string): Promise<TradeApplicationRecord | undefined> {
    const { data, error } = await getSupabaseClient().from(TABLE).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`[${TABLE}] getById: ${error.message}`);
    return data ? toDomain(data as TradeApplicationRow) : undefined;
  },

  async create(values: TradeApplicationValues): Promise<TradeApplicationRecord> {
    let lastError: string | undefined;
    for (let attempt = 0; attempt < MAX_INSERT_ATTEMPTS; attempt++) {
      const reference = generateReference();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- no generated Database type for a dynamic-table client; see supabase-collection.ts for the same gap.
      const { data, error } = await (getSupabaseClient().from(TABLE) as any)
        .insert({
          reference,
          company_name: values.companyName,
          contact_person: values.contactPerson,
          phone: values.phone,
          email: values.email,
          business_type: values.businessType,
          years_in_business: values.yearsInBusiness || null,
          project_locations: values.projectLocations || null,
          typical_project_size: values.typicalProjectSize || null,
          products_of_interest: values.productsOfInterest || null,
        })
        .select()
        .single();
      if (!error) return toDomain(data as TradeApplicationRow);
      if (error.code !== "23505") throw new Error(`[${TABLE}] insert: ${error.message}`);
      lastError = error.message;
    }
    throw new Error(`[${TABLE}] insert: could not generate a unique reference (${lastError})`);
  },

  async updateStatus(
    id: string,
    patch: { status?: TradeApplicationStatus; adminNotes?: string | null }
  ): Promise<TradeApplicationRecord | undefined> {
    const row: Record<string, unknown> = {};
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.adminNotes !== undefined) row.admin_notes = patch.adminNotes || null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- no generated Database type for a dynamic-table client; see supabase-collection.ts for the same gap.
    const { data, error } = await (getSupabaseClient().from(TABLE) as any)
      .update(row)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`[${TABLE}] updateStatus: ${error.message}`);
    return data ? toDomain(data as TradeApplicationRow) : undefined;
  },
};
