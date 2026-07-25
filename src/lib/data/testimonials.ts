import { testimonialsStore } from "@/lib/store/testimonials.store";

export async function getTestimonials() {
  return testimonialsStore.getAll();
}

export async function getTestimonialById(id: string) {
  return testimonialsStore.getByKey(id);
}
