import { ShieldCheck, Wrench, Truck, BadgePercent, Users, HeadphonesIcon } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedCounter } from "@/components/shared/animated-counter";

const reasons = [
  { icon: ShieldCheck, title: "Quality-Assured Products", description: "Sourced from trusted local and international brands, backed by manufacturer warranties." },
  { icon: Wrench, title: "Expert Installation", description: "Trained, insured installation crews for every product category we supply." },
  { icon: Truck, title: "Nationwide Delivery", description: "Reliable logistics to Nairobi and major towns across Kenya." },
  { icon: BadgePercent, title: "Competitive Pricing", description: "Fair retail pricing and bulk rates for contractors and developers." },
  { icon: Users, title: "Trusted by Professionals", description: "Relied on by architects, interior designers and property developers." },
  { icon: HeadphonesIcon, title: "Responsive Support", description: "Fast WhatsApp and phone support from quotation through aftercare." },
];

const stats = [
  { value: 12, suffix: "+", label: "Years in Business" },
  { value: 850, suffix: "+", label: "Projects Completed" },
  { value: 2400, suffix: "+", label: "Happy Clients" },
  { value: 40, suffix: "+", label: "Product Categories" },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Why Maven Enterprise"
        title="Why Choose Maven Enterprise Ltd"
        description="We combine quality products, professional installation and dependable service to make your interior project stress-free from start to finish."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-foreground/5"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6 rounded-3xl bg-secondary/70 p-8 sm:grid-cols-4 sm:p-10">
        {stats.map((stat) => (
          <AnimatedCounter key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
