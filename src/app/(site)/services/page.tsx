import type { Metadata } from "next";
import { getServices } from "@/lib/data/services";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { CtaBanner } from "@/components/home/cta-banner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Interior Installation Services Kenya",
  description:
    "From gypsum and PVC ceiling installation to full office and hotel fit-outs, Maven Enterprise Ltd delivers professional interior finishing services across Kenya.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <div className="pb-8">
      <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Professional Interior Installation Services"
          description="Beyond supplying quality materials, our trained teams handle installation for homes, offices, hotels and commercial buildings across Kenya — managed from consultation through to handover."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
      <div className="mt-12">
        <CtaBanner />
      </div>
    </div>
  );
}
