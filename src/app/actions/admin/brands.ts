"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { brandAdminSchema, type BrandAdminValues } from "@/lib/validation/admin";
import { brandsStore } from "@/lib/store/brands.store";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateBrandPaths() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/brands");
}

export async function createBrand(values: BrandAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = brandAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (brandsStore.getByKey(parsed.data.slug)) {
    return { success: false, error: "A brand with this slug already exists." };
  }
  brandsStore.create(parsed.data);
  revalidateBrandPaths();
  return { success: true };
}

export async function updateBrand(
  originalSlug: string,
  values: BrandAdminValues
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = brandAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!brandsStore.getByKey(originalSlug)) {
    return { success: false, error: "Brand not found." };
  }
  if (parsed.data.slug !== originalSlug && brandsStore.getByKey(parsed.data.slug)) {
    return { success: false, error: "A brand with this slug already exists." };
  }
  brandsStore.remove(originalSlug);
  brandsStore.create(parsed.data);
  revalidateBrandPaths();
  return { success: true };
}

export async function deleteBrand(slug: string): Promise<ActionResult> {
  await requireAdmin();
  if (!brandsStore.getByKey(slug)) {
    return { success: false, error: "Brand not found." };
  }
  brandsStore.remove(slug);
  revalidateBrandPaths();
  return { success: true };
}
