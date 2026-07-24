import { categoriesStore } from "@/lib/store/categories.store";

export function getCategories() {
  return categoriesStore.getAll();
}

export function getCategoryBySlug(slug: string) {
  return categoriesStore.getByKey(slug);
}

export function getSubcategory(categorySlug: string, subcategorySlug: string) {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories.find((s) => s.slug === subcategorySlug);
}
