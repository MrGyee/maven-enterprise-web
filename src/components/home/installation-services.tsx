import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedServices } from "@/lib/data/services";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/services/service-card";

export async function InstallationServices() {
  const services = await getFeaturedServices();
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="What We Do"
          title="Installation Services"
          description="From a single room refresh to full building fit-outs, our professional installation teams handle it all."
        />
        <Link href="/services" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          View all services <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </section>
  );
}
