import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { getServices, getServiceBySlug } from "@/lib/data/services";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";
import { ServiceCard } from "@/components/services/service-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getBusinessInfo } from "@/lib/data/business-info";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.name} Kenya`,
    description: service.shortDescription,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const otherServices = getServices().filter((s) => s.slug !== service.slug).slice(0, 3);
  const businessInfo = getBusinessInfo();

  return (
    <div className="pb-20">
      <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: service.name, href: `/services/${service.slug}` }]} />

      <div className="relative mx-4 overflow-hidden rounded-3xl sm:mx-6 lg:mx-8">
        <div className="relative aspect-[21/9] w-full">
          <Image src={service.heroImage.url} alt={service.heroImage.alt} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          <h1 className="font-heading text-3xl font-semibold text-white sm:text-4xl">{service.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{service.shortDescription}</p>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Overview</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{service.description}</p>

          <h2 className="mt-10 font-heading text-2xl font-semibold text-foreground">Benefits</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2 rounded-xl bg-secondary/60 p-3.5 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                {benefit}
              </li>
            ))}
          </ul>

          {service.gallery.length > 0 && (
            <>
              <h2 className="mt-10 font-heading text-2xl font-semibold text-foreground">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {service.gallery.map((image) => (
                  <div key={image.url} className="relative aspect-square overflow-hidden rounded-xl">
                    <Image src={image.url} alt={image.alt} fill sizes="300px" className="object-cover" />
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className="mt-10 font-heading text-2xl font-semibold text-foreground">Our Process</h2>
          <ol className="mt-4 space-y-4">
            {service.process.map((step, index) => (
              <li key={step.title} className="flex gap-4 rounded-xl border border-border p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h3 className="font-heading text-lg font-semibold text-foreground">Interested in this service?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get a free, no-obligation quotation, or chat with our team directly on WhatsApp.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href={`/quote?service=${encodeURIComponent(service.name)}`}
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              Request Quotation
              <ArrowRight className="size-4" />
            </Link>
            <WhatsappCtaButton
              whatsappNumber={businessInfo.whatsappNumber}
              label="Request Service via WhatsApp"
              message={`Hello Maven Enterprise Ltd, I would like to request your ${service.name} service.`}
              className="w-full"
            />
          </div>
        </aside>
      </div>

      {otherServices.length > 0 && (
        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Other Services</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherServices.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
