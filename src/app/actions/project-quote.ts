"use server";

import { projectQuoteRequestSchema } from "@/lib/validation/forms";
import { saveProjectQuoteRequest } from "@/lib/data/project-quotes";

export type ProjectQuoteActionResult =
  | { success: true; reference: string }
  | { success: false; error: string };

export async function submitProjectQuoteRequest(
  raw: unknown
): Promise<ProjectQuoteActionResult> {
  const parsed = projectQuoteRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  try {
    const record = await saveProjectQuoteRequest(parsed.data);
    return { success: true, reference: record.reference };
  } catch {
    return {
      success: false,
      error: "We couldn't submit your quote right now. Please try again or contact us on WhatsApp.",
    };
  }
}
