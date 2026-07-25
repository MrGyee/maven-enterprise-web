import { teamStore } from "@/lib/store/team.store";

export async function getTeam() {
  return teamStore.getAll();
}

export async function getTeamMemberById(id: string) {
  return teamStore.getByKey(id);
}
