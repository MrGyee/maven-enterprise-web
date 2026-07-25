import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductCategoryBrowser } from "@/components/products/product-category-browser";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return {};
  return {
    title: `${category.name} Kenya | Supply & Installation`,
    description: `${category.description} Shop ${category.name.toLowerCase()} from Maven Enterprise Ltd with professional installation across Kenya.`,
    alternates: { canonical: `/products/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.slug);

  return (
    <div className="pb-20">
      <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: category.name, href: `/products/${category.slug}` }]} />

      <div className="relative mx-4 overflow-hidden rounded-3xl sm:mx-6 lg:mx-8">
        <div className="relative aspect-[21/9] w-full">
          <Image src={category.heroImage.url} alt={category.heroImage.alt} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          <h1 className="font-heading text-3xl font-semibold text-white sm:text-4xl">{category.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{category.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <ProductCategoryBrowser category={category} products={products} />
      </div>
    </div>
  );
}
