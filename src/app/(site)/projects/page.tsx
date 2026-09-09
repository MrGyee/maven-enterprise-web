import type { Metadata } from "next";
import { getProjects } from "@/lib/data/projects";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectsBrowser } from "@/components/projects/projects-browser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Projects | Interior Fit-Out Portfolio Kenya",
  description:
    "Explore Maven Enterprise Ltd's completed residential, commercial, office, hospitality and retail interior finishing projects across Kenya.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="pb-14">
      <Breadcrumbs items={[{ label: "Projects", href: "/projects" }]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Portfolio"
          title="Completed Projects Across Kenya"
          description="From family homes in Karen to hotel fit-outs on the coast, explore a selection of our recent residential, commercial, office, hospitality and retail projects."
        />
        <div className="mt-10">
          <ProjectsBrowser projects={projects} />
        </div>
      </div>
    </div>
  );
}
