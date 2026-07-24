import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { InstallationServices } from "@/components/home/installation-services";
import { ProjectsGallerySection } from "@/components/home/projects-gallery-section";
import { BrandsStrip } from "@/components/home/brands-strip";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { OurProcess } from "@/components/home/our-process";
import { FaqSection } from "@/components/home/faq-section";
import { LatestBlogPosts } from "@/components/home/latest-blog-posts";
import { GoogleMapSection } from "@/components/shared/google-map-section";
import { CtaBanner } from "@/components/home/cta-banner";
import { getBusinessInfo } from "@/lib/data/business-info";
import { heroBannersStore } from "@/lib/store/hero-banners.store";
import { getTestimonials } from "@/lib/data/testimonials";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium Interior Supplies & Installation in Kenya",
  description:
    "Maven Enterprise Ltd supplies and installs premium interior décor, sanitary ware, kitchen fittings, flooring, lighting and plumbing products across Nairobi and Kenya.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const businessInfo = getBusinessInfo();
  const heroBanners = [...heroBannersStore.getAll()].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <Hero images={heroBanners} whatsappNumber={businessInfo.whatsappNumber} />
      <WhyChooseUs />
      <FeaturedCategories />
      <FeaturedProducts />
      <InstallationServices />
      <ProjectsGallerySection />
      <BrandsStrip />
      <TestimonialsSection testimonials={getTestimonials()} />
      <OurProcess />
      <FaqSection />
      <LatestBlogPosts />
      <GoogleMapSection />
      <CtaBanner />
    </>
  );
}
