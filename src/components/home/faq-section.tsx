import { getFaqs } from "@/lib/data/faqs";
import { SectionHeading } from "@/components/shared/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";

export async function FaqSection() {
  const faqs = (await getFaqs()).slice(0, 8);
  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQs"
          title="Frequently Asked Questions"
          description="Answers to common questions about our products, services and coverage areas."
          align="center"
        />
        <div className="mt-10">
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </section>
  );
}
