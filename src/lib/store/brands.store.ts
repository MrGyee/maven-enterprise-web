import { createCollectionStore } from "./collection";
import type { Brand } from "@/lib/data/types";

export const brandsStore = createCollectionStore<Brand>(
  "brands.json",
  (b) => b.slug
);
