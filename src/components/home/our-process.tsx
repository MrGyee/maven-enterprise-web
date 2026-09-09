import { ClipboardList, Calculator, Truck, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const steps = [
  { icon: ClipboardList, title: "Consultation", description: "Tell us about your project via WhatsApp, phone, or our quote form — we'll discuss your needs and site details." },
  { icon: Calculator, title: "Quotation", description: "We prepare a transparent quotation with material options and pricing tailored to your budget." },
  { icon: Truck, title: "Supply & Installation", description: "We deliver quality materials and our trained installers get to work, on schedule." },
  { icon: CheckCircle2, title: "Handover & Aftercare", description: "A final walkthrough confirms everything meets our standards, with aftercare support on hand." },
];

export function OurProcess() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="How It Works"
        title="Our Process"
        description="A simple, transparent process from first enquiry to final handover."
        align="center"
      />
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="relative text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <step.icon className="size-7" />
            </div>
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-foreground">
              {index + 1}
            </span>
            <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
