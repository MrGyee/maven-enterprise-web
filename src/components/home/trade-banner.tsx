import Link from "next/link";
import { ArrowRight, Calculator, FileText, Truck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const highlights = [
  { icon: Calculator, label: "Project & bulk pricing" },
  { icon: FileText, label: "BOQ-based quotations" },
  { icon: Truck, label: "Coordinated material supply" },
];

export function TradeBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-12 sm:px-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Maven Trade</span>
            <h2 className="mt-3 font-heading text-2xl font-semibold text-white sm:text-3xl">
              Procurement Support for Contractors & Developers
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Working on a project? Apply for Maven Trade for project pricing, or send us your BOQ
              directly for a full material quotation.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              {highlights.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 text-sm text-white/85">
                  <Icon className="size-4 text-primary" />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/trade/register" className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}>
              Apply for Maven Trade
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/boq"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-white/30 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white"
              )}
            >
              Submit Your BOQ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
