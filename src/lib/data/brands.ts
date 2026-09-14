import { cache } from "react";
import { brandsStore } from "@/lib/store/brands.store";

export const getBrands = cache(async () => {
  return brandsStore.getAll();
});

export const getBrandBySlug = cache(async (slug: string) => {
  return brandsStore.getByKey(slug);
});
