import { cache } from "react";
import { categoriesStore } from "@/lib/store/categories.store";

export const getCategories = cache(async () => {
  return categoriesStore.getAll();
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return categoriesStore.getByKey(slug);
});

export async function getSubcategory(categorySlug: string, subcategorySlug: string) {
  const category = await getCategoryBySlug(categorySlug);
  return category?.subcategories.find((s) => s.slug === subcategorySlug);
}
