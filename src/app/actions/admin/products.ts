"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { productAdminSchema, type ProductAdminValues } from "@/lib/validation/admin";
import { productsStore } from "@/lib/store/products.store";
import type { Product } from "@/lib/data/types";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateProductPaths(product: Product) {
  revalidatePath("/products");
  revalidatePath(`/products/${product.categorySlug}`);
  revalidatePath(`/products/${product.categorySlug}/${product.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function createProduct(values: ProductAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (await productsStore.getByKey(parsed.data.slug)) {
    return { success: false, error: "A product with this slug already exists." };
  }
  const product: Product = { ...parsed.data, relatedSlugs: [] };
  await productsStore.create(product);
  revalidateProductPaths(product);
  return { success: true };
}

export async function updateProduct(
  originalSlug: string,
  values: ProductAdminValues
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const existing = await productsStore.getByKey(originalSlug);
  if (!existing) {
    return { success: false, error: "Product not found." };
  }
  if (parsed.data.slug !== originalSlug && (await productsStore.getByKey(parsed.data.slug))) {
    return { success: false, error: "A product with this slug already exists." };
  }
  const updated: Product = { ...existing, ...parsed.data };
  await productsStore.remove(originalSlug);
  await productsStore.create(updated);
  revalidateProductPaths(existing);
  revalidateProductPaths(updated);
  return { success: true };
}

export async function deleteProduct(slug: string): Promise<ActionResult> {
  await requireAdmin();
  const existing = await productsStore.getByKey(slug);
  if (!existing) {
    return { success: false, error: "Product not found." };
  }
  await productsStore.remove(slug);
  revalidateProductPaths(existing);
  return { success: true };
}
