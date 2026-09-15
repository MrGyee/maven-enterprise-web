import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { calculators } from "@/lib/calculators";

export const metadata: Metadata = {
  title: "Material Calculators",
  description:
    "Estimate how much flooring, wall panelling or wallpaper you need for your project, with approximate costs based on real Maven Enterprise product pricing.",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsPage() {
  return (
    <div className="pb-14">
      <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Calculators"
          title="Estimate Materials & Cost"
          description="Get a quick estimate of how much material you need and what it will cost, based on your room dimensions and real product pricing."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calc) => (
            <Link
              key={calc.slug}
              href={`/calculators/${calc.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-foreground/5"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calculator className="size-5" />
              </span>
              <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                {calc.label}
              </h2>
              <p className="text-sm text-muted-foreground">{calc.description}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
                Open calculator <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
