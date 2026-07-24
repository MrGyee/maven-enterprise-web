import { createCollectionStore } from "./collection";
import type { Project } from "@/lib/data/types";

export const projectsStore = createCollectionStore<Project>(
  "projects.json",
  (p) => p.slug
);
