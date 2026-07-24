import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Wrench, PackageCheck, ArrowRight } from "lucide-react";
import { getCategoryBySlug, getSubcategory } from "@/lib/data/categories";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductCard } from "@/components/products/product-card";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";
import { JsonLd } from "@/components/shared/json-ld";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getBusinessInfo } from "@/lib/data/business-info";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Buy in Kenya`,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.categorySlug}/${product.slug}` },
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

const stockLabel: Record<string, string> = {
  in_stock: "In Stock",
  made_to_order: "Made to Order",
  out_of_stock: "Out of Stock",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const product = getProductBySlug(slug);
  const category = getCategoryBySlug(categorySlug);
  if (!product || !category || product.categorySlug !== categorySlug) notFound();

  const subcategory = getSubcategory(product.categorySlug, product.subcategorySlug);
  const related = getRelatedProducts(product);
  const businessInfo = getBusinessInfo();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: "Maven Enterprise Ltd" },
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: product.price ?? undefined,
      availability:
        product.stockStatus === "in_stock"
          ? "https://schema.org/InStock"
          : product.stockStatus === "made_to_order"
            ? "https://schema.org/LimitedAvailability"
            : "https://schema.org/OutOfStock",
      url: `https://www.mavenenterprise.co.ke/products/${product.categorySlug}/${product.slug}`,
    },
  };

  return (
    <div className="pb-20">
      <JsonLd data={jsonLd} />
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          { label: category.name, href: `/products/${category.slug}` },
          { label: product.name, href: `/products/${category.slug}/${product.slug}` },
        ]}
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {subcategory && (
            <Link
              href={`/products/${category.slug}`}
              className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
            >
              {category.name} / {subcategory.name}
            </Link>
          )}
          <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground">{product.name}</h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge variant={product.stockStatus === "out_of_stock" ? "destructive" : "default"}>
              <PackageCheck className="size-3" />
              {stockLabel[product.stockStatus]}
            </Badge>
            {product.installationAvailable && (
              <Badge variant="secondary">
                <Wrench className="size-3" />
                Installation Available
              </Badge>
            )}
          </div>

          <p className="mt-5 font-heading text-2xl font-semibold text-foreground">
            {product.price
              ? `KES ${product.price.toLocaleString()}${product.priceUnit ? ` ${product.priceUnit}` : ""}`
              : product.priceUnit ?? "Quote on request"}
          </p>

          {product.features.length > 0 && (
            <div className="mt-6">
              <h2 className="font-heading text-sm font-semibold text-foreground">Key Features</h2>
              <ul className="mt-3 space-y-1.5">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.specifications.length > 0 && (
            <div className="mt-6">
              <h2 className="font-heading text-sm font-semibold text-foreground">Specifications</h2>
              <dl className="mt-3 divide-y divide-border rounded-xl border border-border">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                    <dt className="text-muted-foreground">{spec.label}</dt>
                    <dd className="font-medium text-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/quote?product=${encodeURIComponent(product.name)}`}
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}
            >
              Request Quotation
              <ArrowRight className="size-4" />
            </Link>
            <WhatsappCtaButton
              whatsappNumber={businessInfo.whatsappNumber}
              label="Ask on WhatsApp"
              message={`Hello Maven Enterprise Ltd, I would like to inquire about the ${product.name} (${product.categorySlug}/${product.slug}).`}
            />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Related Products</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
