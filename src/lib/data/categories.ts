import { categoriesStore } from "@/lib/store/categories.store";

export async function getCategories() {
  return categoriesStore.getAll();
}

export async function getCategoryBySlug(slug: string) {
  return categoriesStore.getByKey(slug);
}

export async function getSubcategory(categorySlug: string, subcategorySlug: string) {
  const category = await getCategoryBySlug(categorySlug);
  return category?.subcategories.find((s) => s.slug === subcategorySlug);
}
