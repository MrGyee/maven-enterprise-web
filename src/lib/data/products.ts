import { cache } from "react";
import { productsStore } from "@/lib/store/products.store";
import type { Product } from "@/lib/data/types";

export const getProducts = cache(async () => {
  return productsStore.getAll();
});

export async function getFeaturedProducts() {
  return (await getProducts()).filter((p) => p.featured);
}

export const getProductBySlug = cache(async (slug: string) => {
  return productsStore.getByKey(slug);
});

export async function getProductsByCategory(categorySlug: string) {
  return (await getProducts()).filter((p) => p.categorySlug === categorySlug);
}

export async function getProductsBySubcategory(
  categorySlug: string,
  subcategorySlug: string
) {
  return (await getProducts()).filter(
    (p) => p.categorySlug === categorySlug && p.subcategorySlug === subcategorySlug
  );
}

export async function getRelatedProducts(product: Product) {
  const related = await Promise.all(product.relatedSlugs.map((slug) => getProductBySlug(slug)));
  return related.filter((p): p is Product => Boolean(p));
}
