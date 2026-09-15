import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Home, PenTool, HardHat, Building2, Briefcase, Hotel } from "lucide-react";
import { solutionAudiences, getSolutionAudience } from "@/lib/solutions";
import { getServices } from "@/lib/data/services";
import { getFeaturedProjects, getProjectsByCategory } from "@/lib/data/projects";
import { getTestimonials } from "@/lib/data/testimonials";
import { getBusinessInfo } from "@/lib/data/business-info";
import { buildSolutionWhatsappMessage } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";
import { ServiceCard } from "@/components/services/service-card";
import { ProjectCard } from "@/components/projects/project-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const iconMap = { Home, PenTool, HardHat, Building2, Briefcase, Hotel };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const audience = getSolutionAudience(slug);
  if (!audience) return {};
  return {
    title: audience.heroTitle,
    description: audience.heroDescription,
    alternates: { canonical: `/solutions/${audience.slug}` },
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const audience = getSolutionAudience(slug);
  if (!audience) notFound();

  const [allServices, businessInfo, allTestimonials] = await Promise.all([
    getServices(),
    getBusinessInfo(),
    getTestimonials(),
  ]);

  const services = audience.serviceSlugs
    .map((s) => allServices.find((service) => service.slug === s))
    .filter((s) => s !== undefined);

  const projects =
    audience.projectCategories.length === 0
      ? await getFeaturedProjects()
      : (
          await Promise.all(audience.projectCategories.map((category) => getProjectsByCategory(category)))
        ).flat();

  const testimonials =
    audience.testimonialKeywords.length === 0
      ? allTestimonials.slice(0, 2)
      : allTestimonials.filter((t) =>
          audience.testimonialKeywords.some(
            (keyword) =>
              t.role.toLowerCase().includes(keyword) || t.company?.toLowerCase().includes(keyword)
          )
        );

  const Icon = iconMap[audience.icon];
  const whatsappMessage = buildSolutionWhatsappMessage(audience.label);

  return (
    <div className="pb-14">
      <Breadcrumbs items={[{ label: "Solutions", href: "/solutions" }, { label: audience.label, href: `/solutions/${audience.slug}` }]} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-3xl bg-secondary/50 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-6" />
            </span>
            <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-px w-6 bg-gold" />
              {audience.eyebrow}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {audience.heroTitle}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{audience.heroDescription}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={audience.primaryCta.href} className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}>
              {audience.primaryCta.label}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={audience.secondaryCta.href}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-6")}
            >
              {audience.secondaryCta.label}
            </Link>
          </div>
        </div>

        {services.length > 0 && (
          <div className="mt-14">
            <SectionHeading eyebrow="Relevant Services" title="Services Suited to Your Project" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Our Work" title="Related Projects" />
              <Link href="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                View all projects <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 3).map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        )}

        {testimonials.length > 0 && (
          <div className="mt-14">
            <SectionHeading eyebrow="Client Stories" title="What Our Clients Say" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="relative size-10 overflow-hidden rounded-full bg-muted">
                      <Image src={testimonial.image.url} alt={testimonial.image.alt} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                        {testimonial.company ? `, ${testimonial.company}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl bg-primary px-8 py-10 text-center sm:px-16">
          <h2 className="font-heading text-2xl font-semibold text-primary-foreground sm:text-3xl">
            Ready to Get Started?
          </h2>
          <p className="max-w-xl text-sm text-primary-foreground/85">
            Talk to our team for a free, no-obligation quotation tailored to your project.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={audience.primaryCta.href}
              className={cn(buttonVariants({ size: "lg" }), "h-11 bg-white px-6 text-base text-primary hover:bg-white/90")}
            >
              {audience.primaryCta.label}
              <ArrowRight className="size-4" />
            </Link>
            <WhatsappCtaButton
              whatsappNumber={businessInfo.whatsappNumber}
              message={whatsappMessage}
              label="Chat on WhatsApp"
              className="h-11"
            />
          </div>
        </div>

        <div className="mt-14">
          <SectionHeading eyebrow="Other Solutions" title="Explore Other Audiences" />
          <div className="mt-6 flex flex-wrap gap-3">
            {solutionAudiences
              .filter((a) => a.slug !== audience.slug)
              .map((a) => (
                <Link
                  key={a.slug}
                  href={`/solutions/${a.slug}`}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
                >
                  {a.label}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
