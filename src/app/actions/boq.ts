"use server";

import { boqSubmissionSchema } from "@/lib/validation/forms";
import { saveBoqSubmission, updateBoqSubmission } from "@/lib/data/boq";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidatePath } from "next/cache";
import type { BoqStatus } from "@/lib/store/boq.store";

export type BoqActionResult =
  | { success: true; reference: string }
  | { success: false; error: string };

export async function submitBoqSubmission(raw: unknown): Promise<BoqActionResult> {
  const parsed = boqSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  try {
    const record = await saveBoqSubmission(parsed.data);
    return { success: true, reference: record.reference };
  } catch {
    return {
      success: false,
      error: "We couldn't submit your request right now. Please try again or contact us on WhatsApp.",
    };
  }
}

export async function updateBoqSubmissionAction(
  id: string,
  patch: { status?: BoqStatus; assignedTo?: string; adminNotes?: string }
) {
  await requireAdmin();
  await updateBoqSubmission(id, patch);
  revalidatePath(`/admin/boq/${id}`);
  revalidatePath("/admin/boq");
}
