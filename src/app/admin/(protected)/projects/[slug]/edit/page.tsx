import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data/projects";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { ProjectForm } from "@/components/admin/projects/project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div>
      <AdminListHeader title={`Edit ${project.title}`} description="Update this project's details." />
      <div className="mt-6">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
