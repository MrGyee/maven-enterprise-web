import { brandsStore } from "@/lib/store/brands.store";

export async function getBrands() {
  return brandsStore.getAll();
}

export async function getBrandBySlug(slug: string) {
  return brandsStore.getByKey(slug);
}
