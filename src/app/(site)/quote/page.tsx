import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldCheck, Clock, Wrench } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { QuoteForm } from "@/components/quote/quote-form";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";
import { getBusinessInfo } from "@/lib/data/business-info";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Request a Free Quotation",
  description:
    "Get a free, no-obligation quotation from Maven Enterprise Ltd for interior décor, sanitary ware, kitchen fittings, flooring, lighting or plumbing products and installation across Kenya.",
  alternates: { canonical: "/quote" },
};

const perks = [
  { icon: ShieldCheck, text: "No-obligation, transparent pricing" },
  { icon: Clock, text: "Response within 1 business day" },
  { icon: Wrench, text: "Supply and installation quoted together" },
];

export default async function QuotePage() {
  const businessInfo = await getBusinessInfo();
  return (
    <div className="pb-14">
      <Breadcrumbs items={[{ label: "Request Quotation", href: "/quote" }]} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Free Quotation"
          title="Request a Free Quote"
          description="Tell us about your project and we'll get back to you with a tailored quotation for products, installation, or both."
          align="center"
        />

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {perks.map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-medium text-muted-foreground">
              <Icon className="size-3.5 text-primary" />
              {text}
            </span>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <Suspense>
            <QuoteForm whatsappNumber={businessInfo.whatsappNumber} />
          </Suspense>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Prefer to chat directly?{" "}
            <WhatsappCtaButton
              whatsappNumber={businessInfo.whatsappNumber}
              label="Continue on WhatsApp"
              message="Hello Maven Enterprise Ltd. I would like to request a quotation."
              variant="link"
              className="h-auto p-0 text-primary underline-offset-4 hover:underline"
            />
          </p>
        </div>
      </div>
    </div>
  );
}
