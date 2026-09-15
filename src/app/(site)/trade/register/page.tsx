import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { TradeRegisterForm } from "@/components/trade/trade-register-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Apply for Maven Trade",
  description:
    "Apply for Maven Trade to access project pricing, BOQ support and coordinated material supply for your contracting, development or design projects.",
  alternates: { canonical: "/trade/register" },
};

export default function TradeRegisterPage() {
  return (
    <div className="pb-14">
      <Breadcrumbs items={[{ label: "Trade & BOQ", href: "/trade" }, { label: "Apply", href: "/trade/register" }]} />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Maven Trade"
          title="Apply for Maven Trade"
          description="Tell us about your business and we'll set you up with project pricing and procurement support."
        />
        <div className="mt-8">
          <TradeRegisterForm />
        </div>
      </div>
    </div>
  );
}
