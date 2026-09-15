import { getSupabaseClient } from "@/lib/supabase/server-client";
import { generateReference } from "@/lib/reference";
import type { BoqFile, BoqSubmissionValues } from "@/lib/validation/forms";

export type BoqStatus =
  | "new"
  | "under_review"
  | "pricing"
  | "quote_sent"
  | "customer_reviewing"
  | "approved"
  | "rejected"
  | "completed";

export interface BoqSubmissionRecord {
  id: string;
  reference: string;
  name: string;
  company: string | null;
  phone: string;
  email: string;
  preferredContact: "phone" | "whatsapp" | "email";
  enquiryType: string;
  projectType: string;
  county: string | null;
  area: string | null;
  siteLocation: string | null;
  projectStatus: string;
  requirements: string[];
  files: BoqFile[];
  notes: string | null;
  status: BoqStatus;
  assignedTo: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BoqSubmissionRow {
  id: string;
  reference: string;
  name: string;
  company: string | null;
  phone: string;
  email: string;
  preferred_contact: "phone" | "whatsapp" | "email";
  enquiry_type: string;
  project_type: string;
  county: string | null;
  area: string | null;
  site_location: string | null;
  project_status: string;
  requirements: string[];
  files: BoqFile[];
  notes: string | null;
  status: BoqStatus;
  assigned_to: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

function toDomain(row: BoqSubmissionRow): BoqSubmissionRecord {
  return {
    id: row.id,
    reference: row.reference,
    name: row.name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    preferredContact: row.preferred_contact,
    enquiryType: row.enquiry_type,
    projectType: row.project_type,
    county: row.county,
    area: row.area,
    siteLocation: row.site_location,
    projectStatus: row.project_status,
    requirements: row.requirements,
    files: row.files,
    notes: row.notes,
    status: row.status,
    assignedTo: row.assigned_to,
    adminNotes: row.admin_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const TABLE = "boq_submissions";
const MAX_INSERT_ATTEMPTS = 3;

export const boqStore = {
  async getAll(): Promise<BoqSubmissionRecord[]> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`[${TABLE}] select: ${error.message}`);
    return ((data ?? []) as BoqSubmissionRow[]).map(toDomain);
  },

  async getById(id: string): Promise<BoqSubmissionRecord | undefined> {
    const { data, error } = await getSupabaseClient().from(TABLE).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`[${TABLE}] getById: ${error.message}`);
    return data ? toDomain(data as BoqSubmissionRow) : undefined;
  },

  async create(values: BoqSubmissionValues): Promise<BoqSubmissionRecord> {
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
          preferred_contact: values.preferredContact,
          enquiry_type: values.enquiryType,
          project_type: values.projectType,
          county: values.county || null,
          area: values.area || null,
          site_location: values.siteLocation || null,
          project_status: values.projectStatus,
          requirements: values.requirements,
          files: values.files,
          notes: values.notes || null,
        })
        .select()
        .single();
      if (!error) return toDomain(data as BoqSubmissionRow);
      if (error.code !== "23505") throw new Error(`[${TABLE}] insert: ${error.message}`);
      lastError = error.message;
    }
    throw new Error(`[${TABLE}] insert: could not generate a unique reference (${lastError})`);
  },

  async updateStatus(
    id: string,
    patch: { status?: BoqStatus; assignedTo?: string | null; adminNotes?: string | null }
  ): Promise<BoqSubmissionRecord | undefined> {
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.assignedTo !== undefined) row.assigned_to = patch.assignedTo || null;
    if (patch.adminNotes !== undefined) row.admin_notes = patch.adminNotes || null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- no generated Database type for a dynamic-table client; see supabase-collection.ts for the same gap.
    const { data, error } = await (getSupabaseClient().from(TABLE) as any)
      .update(row)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`[${TABLE}] updateStatus: ${error.message}`);
    return data ? toDomain(data as BoqSubmissionRow) : undefined;
  },
};
