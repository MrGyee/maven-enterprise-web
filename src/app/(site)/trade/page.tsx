import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  FileText,
  Package,
  LayoutGrid,
  Truck,
  Wrench,
  ArrowRight,
  HardHat,
  Building2,
  PenTool,
  Palette,
  Ruler,
  ClipboardCheck,
  Store,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";
import { buildContractorWhatsappMessage } from "@/lib/whatsapp";
import { getBusinessInfo } from "@/lib/data/business-info";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Maven Trade | Procurement for Building & Finishing Professionals",
  description:
    "Maven Trade gives contractors, developers, architects and interior designers access to project pricing, BOQ support and coordinated material supply across Kenya.",
  alternates: { canonical: "/trade" },
};

const advantages = [
  { icon: Calculator, title: "Project Pricing", description: "Get retail, bulk or project-based quotations based on your requirements." },
  { icon: FileText, title: "BOQ Support", description: "Send your BOQ, drawings or material schedule for a full project quotation." },
  { icon: Package, title: "Product Sourcing", description: "Access product guidance and sourcing across our full catalogue." },
  { icon: LayoutGrid, title: "Multiple Categories", description: "Source décor, flooring, bathroom, kitchen, lighting and more from one supplier." },
  { icon: Truck, title: "Delivery Coordination", description: "Coordinate materials across your project instead of managing multiple suppliers." },
  { icon: Wrench, title: "Installation Support", description: "Get professional installation support for selected products and finishing works." },
];

const audiences = [
  { icon: HardHat, label: "Contractors" },
  { icon: Building2, label: "Developers" },
  { icon: PenTool, label: "Architects" },
  { icon: Palette, label: "Interior Designers" },
  { icon: Ruler, label: "Quantity Surveyors" },
  { icon: ClipboardCheck, label: "Project Managers" },
  { icon: Store, label: "Commercial Property Owners" },
];

export default async function TradePage() {
  const businessInfo = await getBusinessInfo();

  return (
    <div className="pb-14">
      <Breadcrumbs items={[{ label: "Trade & BOQ", href: "/trade" }]} />

      <div className="relative overflow-hidden bg-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Maven Trade</span>
          <h1 className="mt-3 font-heading text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Better Procurement for Building &amp; Finishing Professionals
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85">
            Maven Trade gives contractors, developers, architects and interior designers access to
            project pricing, product support and coordinated material supply.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/trade/register" className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}>
              Apply for Maven Trade
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/boq"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 border-white/30 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white")}
            >
              Submit Your BOQ
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What You Get"
          title="Procurement Support Built for Project Work"
          description="Everything you need to source, price and coordinate materials for your next project."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Who It's For" title="Built for Building & Finishing Professionals" align="center" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {audiences.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 rounded-xl bg-card p-5 text-center ring-1 ring-foreground/10">
                <Icon className="size-6 text-primary" />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Ready to Work With Maven Trade?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Apply for Maven Trade, or send us your BOQ directly for a project quotation.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/trade/register" className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}>
            Apply for Maven Trade
            <ArrowRight className="size-4" />
          </Link>
          <WhatsappCtaButton
            whatsappNumber={businessInfo.whatsappNumber}
            message={buildContractorWhatsappMessage()}
            label="WhatsApp Maven Trade"
          />
        </div>
      </div>
    </div>
  );
}
