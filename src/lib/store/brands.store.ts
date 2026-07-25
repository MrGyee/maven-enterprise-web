import { createSupabaseCollectionStore } from "./supabase-collection";
import type { Brand } from "@/lib/data/types";

export const brandsStore = createSupabaseCollectionStore<Brand, Brand>(
  "brands",
  "slug",
  (row) => row,
  (b) => b
);
