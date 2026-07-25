"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { teamMemberAdminSchema, type TeamMemberAdminValues } from "@/lib/validation/admin";
import { teamStore } from "@/lib/store/team.store";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateTeamPaths() {
  revalidatePath("/about");
  revalidatePath("/admin/team");
}

export async function createTeamMember(
  values: Omit<TeamMemberAdminValues, "id">
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = teamMemberAdminSchema.safeParse({ ...values, id: crypto.randomUUID() });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await teamStore.create(parsed.data);
  revalidateTeamPaths();
  return { success: true };
}

export async function updateTeamMember(
  id: string,
  values: TeamMemberAdminValues
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = teamMemberAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!(await teamStore.getByKey(id))) {
    return { success: false, error: "Team member not found." };
  }
  await teamStore.update(id, parsed.data);
  revalidateTeamPaths();
  return { success: true };
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(await teamStore.getByKey(id))) {
    return { success: false, error: "Team member not found." };
  }
  await teamStore.remove(id);
  revalidateTeamPaths();
  return { success: true };
}
