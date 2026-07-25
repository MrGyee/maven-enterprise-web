"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serviceAdminSchema, type ServiceAdminValues } from "@/lib/validation/admin";
import { servicesStore } from "@/lib/store/services.store";
import type { Service } from "@/lib/data/types";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateServicePaths(service: Service) {
  revalidatePath("/services");
  revalidatePath(`/services/${service.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function createService(values: ServiceAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = serviceAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (await servicesStore.getByKey(parsed.data.slug)) {
    return { success: false, error: "A service with this slug already exists." };
  }
  await servicesStore.create(parsed.data);
  revalidateServicePaths(parsed.data);
  return { success: true };
}

export async function updateService(
  originalSlug: string,
  values: ServiceAdminValues
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = serviceAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const existing = await servicesStore.getByKey(originalSlug);
  if (!existing) {
    return { success: false, error: "Service not found." };
  }
  if (parsed.data.slug !== originalSlug && (await servicesStore.getByKey(parsed.data.slug))) {
    return { success: false, error: "A service with this slug already exists." };
  }
  await servicesStore.remove(originalSlug);
  await servicesStore.create(parsed.data);
  revalidateServicePaths(existing);
  revalidateServicePaths(parsed.data);
  return { success: true };
}

export async function deleteService(slug: string): Promise<ActionResult> {
  await requireAdmin();
  const existing = await servicesStore.getByKey(slug);
  if (!existing) {
    return { success: false, error: "Service not found." };
  }
  await servicesStore.remove(slug);
  revalidateServicePaths(existing);
  return { success: true };
}
