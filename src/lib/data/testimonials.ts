import { testimonialsStore } from "@/lib/store/testimonials.store";

export function getTestimonials() {
  return testimonialsStore.getAll();
}

export function getTestimonialById(id: string) {
  return testimonialsStore.getByKey(id);
}
