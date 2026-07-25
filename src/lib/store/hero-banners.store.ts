import { createSupabaseCollectionStore } from "./supabase-collection";
import { getSupabaseClient } from "@/lib/supabase/server-client";
import type { ImageAsset } from "@/lib/data/types";

export interface HeroBanner extends ImageAsset {
  id: string;
  sortOrder: number;
}

interface HeroBannerRow {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
}

function toDomain(row: HeroBannerRow): HeroBanner {
  return { id: row.id, url: row.url, alt: row.alt, sortOrder: row.sort_order };
}

function toRow(b: HeroBanner): HeroBannerRow {
  return { id: b.id, url: b.url, alt: b.alt, sort_order: b.sortOrder };
}

export const heroBannersStore = {
  ...createSupabaseCollectionStore<HeroBannerRow, HeroBanner>("hero_banners", "id", toDomain, toRow),

  // The admin form edits the whole rotation as one list, so replace the
  // full set atomically rather than diffing individual rows.
  async replaceAll(banners: HeroBanner[]): Promise<HeroBanner[]> {
    const client = getSupabaseClient();
    const { error: deleteError } = await client
      .from("hero_banners")
      .delete()
      .not("id", "is", null);
    if (deleteError) throw new Error(`[hero_banners] replaceAll delete: ${deleteError.message}`);

    if (banners.length === 0) return [];

    // No generated Database schema type, so insert() can't infer this
    // table's row shape and resolves its payload param to `never`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: insertError } = await (client.from("hero_banners") as any)
      .insert(banners.map(toRow))
      .select();
    if (insertError) throw new Error(`[hero_banners] replaceAll insert: ${insertError.message}`);
    return (data as HeroBannerRow[]).map(toDomain);
  },
};
