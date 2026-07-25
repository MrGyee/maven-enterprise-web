import { projectsStore } from "@/lib/store/projects.store";

export async function getProjects() {
  return projectsStore.getAll();
}

export async function getFeaturedProjects() {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProjectsByCategory(category: string) {
  const all = await getProjects();
  if (category === "all") return all;
  return all.filter((p) => p.category === category);
}

export async function getProjectBySlug(slug: string) {
  return projectsStore.getByKey(slug);
}
