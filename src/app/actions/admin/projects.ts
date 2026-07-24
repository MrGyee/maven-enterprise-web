"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { projectAdminSchema, type ProjectAdminValues } from "@/lib/validation/admin";
import { projectsStore } from "@/lib/store/projects.store";
import type { Project } from "@/lib/data/types";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateProjectPaths(project: Project) {
  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function createProject(values: ProjectAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (projectsStore.getByKey(parsed.data.slug)) {
    return { success: false, error: "A project with this slug already exists." };
  }
  projectsStore.create(parsed.data);
  revalidateProjectPaths(parsed.data);
  return { success: true };
}

export async function updateProject(
  originalSlug: string,
  values: ProjectAdminValues
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const existing = projectsStore.getByKey(originalSlug);
  if (!existing) {
    return { success: false, error: "Project not found." };
  }
  if (parsed.data.slug !== originalSlug && projectsStore.getByKey(parsed.data.slug)) {
    return { success: false, error: "A project with this slug already exists." };
  }
  projectsStore.remove(originalSlug);
  projectsStore.create(parsed.data);
  revalidateProjectPaths(existing);
  revalidateProjectPaths(parsed.data);
  return { success: true };
}

export async function deleteProject(slug: string): Promise<ActionResult> {
  await requireAdmin();
  const existing = projectsStore.getByKey(slug);
  if (!existing) {
    return { success: false, error: "Project not found." };
  }
  projectsStore.remove(slug);
  revalidateProjectPaths(existing);
  return { success: true };
}
