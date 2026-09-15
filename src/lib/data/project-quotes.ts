import { projectQuoteStore } from "@/lib/store/project-quotes.store";
import type { ProjectQuoteRequestValues } from "@/lib/validation/forms";

export async function getProjectQuoteRequests() {
  return projectQuoteStore.getAll();
}

export async function saveProjectQuoteRequest(values: ProjectQuoteRequestValues) {
  return projectQuoteStore.create(values);
}
