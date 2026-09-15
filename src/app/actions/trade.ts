"use server";

import { revalidatePath } from "next/cache";
import { tradeApplicationSchema } from "@/lib/validation/forms";
import { saveTradeApplication, updateTradeApplication } from "@/lib/data/trade";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { TradeApplicationStatus } from "@/lib/store/trade.store";

export type TradeActionResult =
  | { success: true; reference: string }
  | { success: false; error: string };

export async function submitTradeApplication(raw: unknown): Promise<TradeActionResult> {
  const parsed = tradeApplicationSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  try {
    const record = await saveTradeApplication(parsed.data);
    return { success: true, reference: record.reference };
  } catch {
    return {
      success: false,
      error: "We couldn't submit your application right now. Please try again or contact us on WhatsApp.",
    };
  }
}

export async function updateTradeApplicationAction(
  id: string,
  patch: { status?: TradeApplicationStatus; adminNotes?: string }
) {
  await requireAdmin();
  await updateTradeApplication(id, patch);
  revalidatePath(`/admin/trade/${id}`);
  revalidatePath("/admin/trade");
}
