import { createCollectionStore } from "./collection";
import type { TeamMember } from "@/lib/data/types";

export const teamStore = createCollectionStore<TeamMember>(
  "team.json",
  (t) => t.id
);
