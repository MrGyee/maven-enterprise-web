"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { businessInfoAdminSchema, type BusinessInfoAdminValues } from "@/lib/validation/admin";
import { businessInfoStore } from "@/lib/store/business-info.store";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateBusinessInfo(values: BusinessInfoAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = businessInfoAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await businessInfoStore.update(parsed.data);
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings/business-info");
  return { success: true };
}
