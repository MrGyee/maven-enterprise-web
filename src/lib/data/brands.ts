import { brandsStore } from "@/lib/store/brands.store";

export function getBrands() {
  return brandsStore.getAll();
}

export function getBrandBySlug(slug: string) {
  return brandsStore.getByKey(slug);
}
