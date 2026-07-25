import { getSupabaseClient } from "@/lib/supabase/server-client";
import type { BusinessInfo } from "@/lib/data/types";

interface BusinessInfoRow {
  id: number;
  legal_name: string;
  tagline: string;
  phones: string[];
  whatsapp_number: string;
  email: string;
  address: BusinessInfo["address"];
  hours: BusinessInfo["hours"];
  socials: BusinessInfo["socials"];
  map_embed_url: string;
  coordinates: BusinessInfo["coordinates"];
  service_areas: string[];
}

function toDomain(row: BusinessInfoRow): BusinessInfo {
  return {
    legalName: row.legal_name,
    tagline: row.tagline,
    phones: row.phones,
    whatsappNumber: row.whatsapp_number,
    email: row.email,
    address: row.address,
    hours: row.hours,
    socials: row.socials,
    mapEmbedUrl: row.map_embed_url,
    coordinates: row.coordinates,
    serviceAreas: row.service_areas,
  };
}

function toRow(b: BusinessInfo): Omit<BusinessInfoRow, "id"> {
  return {
    legal_name: b.legalName,
    tagline: b.tagline,
    phones: b.phones,
    whatsapp_number: b.whatsappNumber,
    email: b.email,
    address: b.address,
    hours: b.hours,
    socials: b.socials,
    map_embed_url: b.mapEmbedUrl,
    coordinates: b.coordinates,
    service_areas: b.serviceAreas,
  };
}

export const businessInfoStore = {
  async get(): Promise<BusinessInfo> {
    const { data, error } = await getSupabaseClient()
      .from("business_info")
      .select("*")
      .eq("id", 1)
      .single();
    if (error) throw new Error(`[business_info] get: ${error.message}`);
    return toDomain(data as BusinessInfoRow);
  },

  async update(patch: Partial<BusinessInfo>): Promise<BusinessInfo> {
    const current = await businessInfoStore.get();
    const merged = { ...current, ...patch };
    // No generated Database schema type, so update() can't infer this
    // table's row shape and resolves its payload param to `never`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (getSupabaseClient().from("business_info") as any)
      .update(toRow(merged))
      .eq("id", 1)
      .select()
      .single();
    if (error) throw new Error(`[business_info] update: ${error.message}`);
    return toDomain(data as BusinessInfoRow);
  },
};
