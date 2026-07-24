"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { testimonialAdminSchema, type TestimonialAdminValues } from "@/lib/validation/admin";
import { testimonialsStore } from "@/lib/store/testimonials.store";
import { generateId } from "@/lib/store/json-file";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateTestimonialPaths() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function createTestimonial(
  values: Omit<TestimonialAdminValues, "id">
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = testimonialAdminSchema.safeParse({ ...values, id: generateId() });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  testimonialsStore.create(parsed.data);
  revalidateTestimonialPaths();
  return { success: true };
}

export async function updateTestimonial(
  id: string,
  values: TestimonialAdminValues
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = testimonialAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!testimonialsStore.getByKey(id)) {
    return { success: false, error: "Testimonial not found." };
  }
  testimonialsStore.update(id, parsed.data);
  revalidateTestimonialPaths();
  return { success: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!testimonialsStore.getByKey(id)) {
    return { success: false, error: "Testimonial not found." };
  }
  testimonialsStore.remove(id);
  revalidateTestimonialPaths();
  return { success: true };
}
