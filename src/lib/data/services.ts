import { cache } from "react";
import { servicesStore } from "@/lib/store/services.store";

export const getServices = cache(async () => {
  return servicesStore.getAll();
});

export async function getFeaturedServices() {
  return (await getServices()).filter((s) => s.featured);
}

export const getServiceBySlug = cache(async (slug: string) => {
  return servicesStore.getByKey(slug);
});
