import { projectsStore } from "@/lib/store/projects.store";

export function getProjects() {
  return projectsStore.getAll();
}

export function getFeaturedProjects() {
  return getProjects().filter((p) => p.featured);
}

export function getProjectsByCategory(category: string) {
  if (category === "all") return getProjects();
  return getProjects().filter((p) => p.category === category);
}

export function getProjectBySlug(slug: string) {
  return projectsStore.getByKey(slug);
}
