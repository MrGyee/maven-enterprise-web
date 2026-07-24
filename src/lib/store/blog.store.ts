import { createCollectionStore } from "./collection";
import type { BlogPost } from "@/lib/data/types";

export const blogStore = createCollectionStore<BlogPost>(
  "blog.json",
  (p) => p.slug
);
