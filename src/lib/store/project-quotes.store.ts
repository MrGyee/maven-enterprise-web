import { getSupabaseClient } from "@/lib/supabase/server-client";
import { generateReference } from "@/lib/reference";
import type { ProjectQuoteItem, ProjectQuoteRequestValues } from "@/lib/validation/forms";

export type ProjectQuoteStatus = "new" | "reviewing" | "quoted" | "closed";

export interface ProjectQuoteRequestRecord {
  id: string;
  reference: string;
  name: string;
  company: string | null;
  phone: string;
  email: string;
  items: ProjectQuoteItem[];
  notes: string | null;
  status: ProjectQuoteStatus;
  createdAt: string;
}

interface ProjectQuoteRequestRow {
  id: string;
  reference: string;
  name: string;
  company: string | null;
  phone: string;
  email: string;
  items: ProjectQuoteItem[];
  notes: string | null;
  status: ProjectQuoteStatus;
  created_at: string;
}

function toDomain(row: ProjectQuoteRequestRow): ProjectQuoteRequestRecord {
  return {
    id: row.id,
    reference: row.reference,
    name: row.name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    items: row.items,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
  };
}

const TABLE = "project_quote_requests";
const MAX_INSERT_ATTEMPTS = 3;

export const projectQuoteStore = {
  async getAll(): Promise<ProjectQuoteRequestRecord[]> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`[${TABLE}] select: ${error.message}`);
    return ((data ?? []) as ProjectQuoteRequestRow[]).map(toDomain);
  },

  // The reference column is unique; on the (very unlikely) chance of a
  // collision, generate a fresh one and retry rather than fail the request.
  async create(values: ProjectQuoteRequestValues): Promise<ProjectQuoteRequestRecord> {
    let lastError: string | undefined;
    for (let attempt = 0; attempt < MAX_INSERT_ATTEMPTS; attempt++) {
      const reference = generateReference();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- no generated Database type for a dynamic-table client; see supabase-collection.ts for the same gap.
      const { data, error } = await (getSupabaseClient().from(TABLE) as any)
        .insert({
          reference,
          name: values.name,
          company: values.company || null,
          phone: values.phone,
          email: values.email,
          items: values.items,
          notes: values.notes || null,
        })
        .select()
        .single();
      if (!error) return toDomain(data as ProjectQuoteRequestRow);
      if (error.code !== "23505") throw new Error(`[${TABLE}] insert: ${error.message}`);
      lastError = error.message;
    }
    throw new Error(`[${TABLE}] insert: could not generate a unique reference (${lastError})`);
  },
};
