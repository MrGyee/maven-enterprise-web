import { createCollectionStore } from "./collection";
import type { Service } from "@/lib/data/types";

export const servicesStore = createCollectionStore<Service>(
  "services.json",
  (s) => s.slug
);
