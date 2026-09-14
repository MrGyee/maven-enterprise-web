import { cache } from "react";
import { teamStore } from "@/lib/store/team.store";

export const getTeam = cache(async () => {
  return teamStore.getAll();
});

export const getTeamMemberById = cache(async (id: string) => {
  return teamStore.getByKey(id);
});
