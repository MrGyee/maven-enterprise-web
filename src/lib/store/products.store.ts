import { createCollectionStore } from "./collection";
import type { Product } from "@/lib/data/types";

export const productsStore = createCollectionStore<Product>(
  "products.json",
  (p) => p.slug
);
