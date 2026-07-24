import { servicesStore } from "@/lib/store/services.store";

export function getServices() {
  return servicesStore.getAll();
}

export function getFeaturedServices() {
  return getServices().filter((s) => s.featured);
}

export function getServiceBySlug(slug: string) {
  return servicesStore.getByKey(slug);
}
