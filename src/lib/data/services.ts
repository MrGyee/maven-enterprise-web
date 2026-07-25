import { servicesStore } from "@/lib/store/services.store";

export async function getServices() {
  return servicesStore.getAll();
}

export async function getFeaturedServices() {
  return (await getServices()).filter((s) => s.featured);
}

export async function getServiceBySlug(slug: string) {
  return servicesStore.getByKey(slug);
}
