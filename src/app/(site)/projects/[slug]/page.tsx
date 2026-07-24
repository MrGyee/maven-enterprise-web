import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { getProjectBySlug } from "@/lib/data/projects";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";
import { cn } from "@/lib/utils";
import { getBusinessInfo } from "@/lib/data/business-info";

const categoryLabel: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  office: "Office",
  hospitality: "Hospitality",
  retail: "Retail",
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} | Case Study`,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const businessInfo = getBusinessInfo();

  return (
    <div className="pb-20">
      <Breadcrumbs items={[{ label: "Projects", href: "/projects" }, { label: project.title, href: `/projects/${project.slug}` }]} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{categoryLabel[project.category]}</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            {project.location}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            Completed {new Date(project.completedDate).toLocaleDateString("en-KE", { year: "numeric", month: "long" })}
          </span>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-foreground sm:text-4xl">{project.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{project.description}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Before</span>
            <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={project.beforeImage.url} alt={project.beforeImage.alt} fill sizes="50vw" className="object-cover grayscale" />
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">After</span>
            <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={project.afterImages[0].url} alt={project.afterImages[0].alt} fill sizes="50vw" className="object-cover" />
            </div>
          </div>
        </div>

        {project.afterImages.length > 1 && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {project.afterImages.slice(1).map((image) => (
              <div key={image.url} className="relative aspect-square overflow-hidden rounded-xl">
                <Image src={image.url} alt={image.alt} fill sizes="300px" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">Services Provided</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.servicesProvided.map((service) => (
                <li key={service} className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">
                  {service}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">Materials Used</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.materialsUsed.map((material) => (
                <li key={material} className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
                  {material}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3 rounded-2xl bg-secondary/60 p-6">
          <p className="mr-auto text-sm font-medium text-foreground">Have a similar project in mind?</p>
          <Link href="/quote" className={cn(buttonVariants({ size: "lg" }))}>
            Request Quotation
            <ArrowRight className="size-4" />
          </Link>
          <WhatsappCtaButton
            whatsappNumber={businessInfo.whatsappNumber}
            message={`Hello Maven Enterprise Ltd, I saw your ${project.title} project and would like to discuss a similar project.`}
          />
        </div>
      </div>
    </div>
  );
}
