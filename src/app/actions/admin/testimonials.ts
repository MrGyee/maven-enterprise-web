"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { testimonialAdminSchema, type TestimonialAdminValues } from "@/lib/validation/admin";
import { testimonialsStore } from "@/lib/store/testimonials.store";

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
  const parsed = testimonialAdminSchema.safeParse({ ...values, id: crypto.randomUUID() });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await testimonialsStore.create(parsed.data);
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
  if (!(await testimonialsStore.getByKey(id))) {
    return { success: false, error: "Testimonial not found." };
  }
  await testimonialsStore.update(id, parsed.data);
  revalidateTestimonialPaths();
  return { success: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(await testimonialsStore.getByKey(id))) {
    return { success: false, error: "Testimonial not found." };
  }
  await testimonialsStore.remove(id);
  revalidateTestimonialPaths();
  return { success: true };
}
