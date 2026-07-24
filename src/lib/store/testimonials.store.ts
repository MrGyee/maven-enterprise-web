import { createCollectionStore } from "./collection";
import type { Testimonial } from "@/lib/data/types";

export const testimonialsStore = createCollectionStore<Testimonial>(
  "testimonials.json",
  (t) => t.id
);
