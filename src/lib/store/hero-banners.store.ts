import { createCollectionStore } from "./collection";
import type { ImageAsset } from "@/lib/data/types";

export interface HeroBanner extends ImageAsset {
  id: string;
  sortOrder: number;
}

export const heroBannersStore = createCollectionStore<HeroBanner>(
  "hero-banners.json",
  (b) => b.id
);
