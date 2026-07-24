import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/data/categories";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Interior Supplies Kenya | Shop All Product Categories",
  description:
    "Browse Maven Enterprise Ltd's full range of interior finishing products: décor, flooring, bathroom, kitchen, lighting, doors & hardware and plumbing supplies across Kenya.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const categories = getCategories();
  return (
    <div className="pb-20">
      <Breadcrumbs items={[{ label: "Products", href: "/products" }]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Range"
          title="Interior Supplies for Every Project"
          description="Explore our full catalogue of interior décor, flooring, bathroom, kitchen, lighting, doors & hardware, plumbing and general finishing supplies — all available with professional installation across Kenya."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-lg hover:shadow-foreground/5"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <Image
                  src={category.heroImage.url}
                  alt={category.heroImage.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                  {category.name}
                </h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                  {category.subcategories.slice(0, 4).map((sub) => (
                    <span
                      key={sub.slug}
                      className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {sub.name}
                    </span>
                  ))}
                  {category.subcategories.length > 4 && (
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                      +{category.subcategories.length - 4} more
                    </span>
                  )}
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Browse category <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
