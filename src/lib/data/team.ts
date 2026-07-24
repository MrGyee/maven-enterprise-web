import { teamStore } from "@/lib/store/team.store";

export function getTeam() {
  return teamStore.getAll();
}

export function getTeamMemberById(id: string) {
  return teamStore.getByKey(id);
}
