import { getBusinessInfo } from "@/lib/data/business-info";
import { SectionHeading } from "@/components/shared/section-heading";

export function GoogleMapSection() {
  const businessInfo = getBusinessInfo();
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Find Us"
        title="Visit Our Showroom"
        description={`${businessInfo.address.street}, ${businessInfo.address.city}, ${businessInfo.address.country}`}
      />
      <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-foreground/10">
        <iframe
          src={businessInfo.mapEmbedUrl}
          title="Maven Enterprise Ltd location map"
          className="h-[400px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
