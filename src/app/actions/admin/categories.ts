"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { categoryAdminSchema, type CategoryAdminValues } from "@/lib/validation/admin";
import { categoriesStore } from "@/lib/store/categories.store";
import type { Category } from "@/lib/data/types";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateCategoryPaths(category: Category) {
  revalidatePath("/products");
  revalidatePath(`/products/${category.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function createCategory(values: CategoryAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = categoryAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (categoriesStore.getByKey(parsed.data.slug)) {
    return { success: false, error: "A category with this slug already exists." };
  }
  categoriesStore.create(parsed.data);
  revalidateCategoryPaths(parsed.data);
  return { success: true };
}

export async function updateCategory(
  originalSlug: string,
  values: CategoryAdminValues
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = categoryAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const existing = categoriesStore.getByKey(originalSlug);
  if (!existing) {
    return { success: false, error: "Category not found." };
  }
  if (parsed.data.slug !== originalSlug && categoriesStore.getByKey(parsed.data.slug)) {
    return { success: false, error: "A category with this slug already exists." };
  }
  categoriesStore.remove(originalSlug);
  categoriesStore.create(parsed.data);
  revalidateCategoryPaths(existing);
  revalidateCategoryPaths(parsed.data);
  return { success: true };
}

export async function deleteCategory(slug: string): Promise<ActionResult> {
  await requireAdmin();
  const existing = categoriesStore.getByKey(slug);
  if (!existing) {
    return { success: false, error: "Category not found." };
  }
  categoriesStore.remove(slug);
  revalidateCategoryPaths(existing);
  return { success: true };
}
