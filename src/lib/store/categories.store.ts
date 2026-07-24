import { createCollectionStore } from "./collection";
import type { Category } from "@/lib/data/types";

export const categoriesStore = createCollectionStore<Category>(
  "categories.json",
  (c) => c.slug
);
