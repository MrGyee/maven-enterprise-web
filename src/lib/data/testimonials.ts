import { cache } from "react";
import { testimonialsStore } from "@/lib/store/testimonials.store";

export const getTestimonials = cache(async () => {
  return testimonialsStore.getAll();
});

export const getTestimonialById = cache(async (id: string) => {
  return testimonialsStore.getByKey(id);
});
