import { productsStore } from "@/lib/store/products.store";
import type { Product } from "@/lib/data/types";

export function getProducts() {
  return productsStore.getAll();
}

export function getFeaturedProducts() {
  return getProducts().filter((p) => p.featured);
}

export function getProductBySlug(slug: string) {
  return productsStore.getByKey(slug);
}

export function getProductsByCategory(categorySlug: string) {
  return getProducts().filter((p) => p.categorySlug === categorySlug);
}

export function getProductsBySubcategory(
  categorySlug: string,
  subcategorySlug: string
) {
  return getProducts().filter(
    (p) => p.categorySlug === categorySlug && p.subcategorySlug === subcategorySlug
  );
}

export function getRelatedProducts(product: Product) {
  return product.relatedSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is Product => Boolean(p));
}
