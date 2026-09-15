import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, PenTool, HardHat, Building2, Briefcase, Hotel } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { solutionAudiences } from "@/lib/solutions";

const iconMap = { Home, PenTool, HardHat, Building2, Briefcase, Hotel };

export const metadata: Metadata = {
  title: "Solutions by Audience",
  description:
    "Interior supply and installation solutions tailored for homeowners, architects, interior designers, contractors, developers, commercial projects and hospitality spaces in Kenya.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <div className="pb-14">
      <Breadcrumbs items={[{ label: "Solutions", href: "/solutions" }]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Solutions"
          title="Built for Who You Are"
          description="Whether you're renovating your home or managing a portfolio of projects, we tailor products, pricing and support to how you work."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutionAudiences.map((audience) => {
            const Icon = iconMap[audience.icon];
            return (
              <Link
                key={audience.slug}
                href={`/solutions/${audience.slug}`}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-foreground/5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                  {audience.label}
                </h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">{audience.heroDescription}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
                  View solutions <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
