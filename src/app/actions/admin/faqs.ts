"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { faqAdminSchema, type FaqAdminValues } from "@/lib/validation/admin";
import { faqsStore } from "@/lib/store/faqs.store";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateFaqPaths() {
  revalidatePath("/");
  revalidatePath("/admin/faqs");
}

export async function createFaq(values: Omit<FaqAdminValues, "id">): Promise<ActionResult> {
  await requireAdmin();
  const parsed = faqAdminSchema.safeParse({ ...values, id: crypto.randomUUID() });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await faqsStore.create(parsed.data);
  revalidateFaqPaths();
  return { success: true };
}

export async function updateFaq(id: string, values: FaqAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = faqAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!(await faqsStore.getByKey(id))) {
    return { success: false, error: "FAQ not found." };
  }
  await faqsStore.update(id, parsed.data);
  revalidateFaqPaths();
  return { success: true };
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(await faqsStore.getByKey(id))) {
    return { success: false, error: "FAQ not found." };
  }
  await faqsStore.remove(id);
  revalidateFaqPaths();
  return { success: true };
}
