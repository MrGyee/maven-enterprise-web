import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCalculatorConfig, getSpecValue, parseCoverageAreaM2, type CalculatorProduct } from "@/lib/calculators";
import { getProducts } from "@/lib/data/products";
import { getBusinessInfo } from "@/lib/data/business-info";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { MaterialCalculator } from "@/components/calculators/material-calculator";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = getCalculatorConfig(slug);
  if (!config) return {};
  return {
    title: config.title,
    description: config.description,
    alternates: { canonical: `/calculators/${config.slug}` },
  };
}

export default async function CalculatorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getCalculatorConfig(slug);
  if (!config) notFound();

  const [allProducts, businessInfo] = await Promise.all([getProducts(), getBusinessInfo()]);

  let products: CalculatorProduct[] = [];

  if (config.slug === "flooring") {
    products = allProducts
      .filter((p) => p.categorySlug === "flooring" && p.priceUnit === "per m²")
      .map((p) => ({ slug: p.slug, name: p.name, image: p.images[0]?.url, price: p.price }));
  } else if (config.specLabel) {
    const targetUnit = config.slug === "wall-panels" ? "per panel" : "per roll";
    products = allProducts
      .filter((p) => p.priceUnit === targetUnit)
      .map((p): CalculatorProduct | null => {
        const spec = getSpecValue(p, config.specLabel!);
        const coverageM2 = spec ? parseCoverageAreaM2(spec) : null;
        if (!coverageM2) return null;
        return { slug: p.slug, name: p.name, image: p.images[0]?.url, price: p.price, coverageM2 };
      })
      .filter((p): p is CalculatorProduct => p !== null);
  }

  if (products.length === 0) notFound();

  return (
    <div className="pb-14">
      <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: config.label, href: `/calculators/${config.slug}` }]} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={config.eyebrow} title={config.title} description={config.description} />
        <div className="mt-10">
          <MaterialCalculator products={products} unitName={config.unitName} whatsappNumber={businessInfo.whatsappNumber} />
        </div>
      </div>
    </div>
  );
}
