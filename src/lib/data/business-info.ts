import { businessInfoStore } from "@/lib/store/business-info.store";
import type { BusinessInfo } from "@/lib/data/types";
import { buildWhatsappLink } from "@/lib/whatsapp";

export { defaultWhatsappMessage } from "@/lib/whatsapp";

// Server-only: reads the current business info from the JSON store. Do not
// import this from a "use client" file — see src/lib/whatsapp.ts for the
// client-safe helpers, and thread the fields you need down as props instead.
export function getBusinessInfo(): BusinessInfo {
  return businessInfoStore.get();
}

export function whatsappLink(message: string) {
  return buildWhatsappLink(getBusinessInfo().whatsappNumber, message);
}

export function getLocalBusinessJsonLd() {
  const businessInfo = getBusinessInfo();
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: businessInfo.legalName,
    description:
      "Supplier, distributor and installer of interior finishing products across Kenya, including décor, sanitary ware, kitchen fittings, flooring, lighting and plumbing supplies.",
    image: "https://www.mavenenterprise.co.ke/opengraph-image",
    telephone: businessInfo.phones[0],
    email: businessInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address.street,
      addressLocality: businessInfo.address.city,
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: businessInfo.coordinates.lat,
      longitude: businessInfo.coordinates.lng,
    },
    areaServed: businessInfo.serviceAreas,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "16:00",
      },
    ],
    sameAs: Object.values(businessInfo.socials),
    url: "https://www.mavenenterprise.co.ke",
  };
}
