import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Project } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";

const categoryLabel: Record<Project["category"], string> = {
  residential: "Residential",
  commercial: "Commercial",
  office: "Office",
  hospitality: "Hospitality",
  retail: "Retail",
};

export function ProjectCard({ project }: { project: Project }) {
  const image = project.afterImages[0] ?? project.beforeImage;
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-lg hover:shadow-foreground/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3">{categoryLabel[project.category]}</Badge>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
          {project.title}
        </h3>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          {project.location}
        </span>
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
      </div>
    </Link>
  );
}
