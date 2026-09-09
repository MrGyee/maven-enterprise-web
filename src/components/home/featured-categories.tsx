import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/data/categories";
import { SectionHeading } from "@/components/shared/section-heading";

export async function FeaturedCategories() {
  const categories = await getCategories();
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Our Range"
          title="Shop by Category"
          description="Everything you need for a complete interior finishing project, all in one place."
        />
        <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          View all categories <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products/${category.slug}`}
            className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-2xl"
          >
            <Image
              src={category.heroImage.url}
              alt={category.heroImage.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 p-5 text-white">
              <h3 className="font-heading text-lg font-semibold">{category.name}</h3>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-white/80">
                {category.subcategories.length} subcategories
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
