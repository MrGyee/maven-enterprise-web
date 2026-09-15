import { boqStore, type BoqStatus } from "@/lib/store/boq.store";
import type { BoqSubmissionValues } from "@/lib/validation/forms";

export async function getBoqSubmissions() {
  return boqStore.getAll();
}

export async function getBoqSubmissionById(id: string) {
  return boqStore.getById(id);
}

export async function saveBoqSubmission(values: BoqSubmissionValues) {
  return boqStore.create(values);
}

export async function updateBoqSubmission(
  id: string,
  patch: { status?: BoqStatus; assignedTo?: string | null; adminNotes?: string | null }
) {
  return boqStore.updateStatus(id, patch);
}
