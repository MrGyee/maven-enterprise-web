"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { heroBannersAdminSchema, type HeroBannerAdminValues } from "@/lib/validation/admin";
import { heroBannersStore } from "@/lib/store/hero-banners.store";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateHeroBanners(banners: HeroBannerAdminValues[]): Promise<ActionResult> {
  await requireAdmin();
  const parsed = heroBannersAdminSchema.safeParse(banners);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await heroBannersStore.replaceAll(parsed.data);
  revalidatePath("/");
  revalidatePath("/admin/hero-banners");
  return { success: true };
}
