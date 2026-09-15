import { cache } from "react";
import { businessInfoStore } from "@/lib/store/business-info.store";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { getTestimonials } from "@/lib/data/testimonials";

export { defaultWhatsappMessage } from "@/lib/whatsapp";

// Server-only: reads the current business info from Supabase. Do not
// import this from a "use client" file — see src/lib/whatsapp.ts for the
// client-safe helpers, and thread the fields you need down as props instead.
// cache()'d because layout, footer, and several homepage sections each call
// this independently — without it, one page load fires off 5+ identical
// Supabase queries instead of 1.
export const getBusinessInfo = cache(async () => {
  return businessInfoStore.get();
});

export async function whatsappLink(message: string) {
  const businessInfo = await getBusinessInfo();
  return buildWhatsappLink(businessInfo.whatsappNumber, message);
}

export async function getLocalBusinessJsonLd() {
  const businessInfo = await getBusinessInfo();
  const testimonials = await getTestimonials();
  const ratingCount = testimonials.length;
  const aggregateRating =
    ratingCount > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: (
            testimonials.reduce((sum, t) => sum + t.rating, 0) / ratingCount
          ).toFixed(1),
          reviewCount: ratingCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;
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
    aggregateRating,
  };
}
