import { getBrands } from "@/lib/data/brands";
import { SectionHeading } from "@/components/shared/section-heading";

export function BrandsStrip() {
  const brands = getBrands();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Our Partners" title="Brands We Stock" align="center" />
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {brands.map((brand) => (
          <span
            key={brand.slug}
            className="font-heading text-lg font-semibold tracking-wide text-muted-foreground/70 grayscale transition-all hover:text-primary hover:grayscale-0"
          >
            {brand.name}
          </span>
        ))}
      </div>
    </section>
  );
}
