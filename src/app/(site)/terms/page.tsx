import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getBusinessInfo } from "@/lib/data/business-info";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Maven Enterprise Ltd website and services.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  const businessInfo = getBusinessInfo();
  const lastUpdated = new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="pb-20">
      <Breadcrumbs items={[{ label: "Terms of Service", href: "/terms" }]} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold" />
          <p>
            <strong>Template content.</strong> This is a generic starting
            point, not legal advice. Have a qualified lawyer review this page
            against your actual sales, warranty and installation terms
            before relying on it.
          </p>
        </div>

        <h1 className="mt-8 font-heading text-3xl font-semibold text-foreground">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By accessing or using the {businessInfo.legalName} website, you
              agree to be bound by these Terms of Service. If you do not
              agree, please do not use this website.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">2. Products &amp; Pricing</h2>
            <p className="mt-2">
              Product information, images and prices shown on this website
              are for general guidance and may change without notice. Final
              pricing is confirmed at the point of quotation. Product
              photography is illustrative; actual products may vary
              slightly in colour, texture or finish.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">3. Quotations &amp; Orders</h2>
            <p className="mt-2">
              Submitting a quote request through this website does not
              constitute a binding order. A quotation becomes binding only
              once confirmed in writing and, where applicable, a deposit is
              received.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">4. Installation Services</h2>
            <p className="mt-2">
              Installation timelines communicated through this website or by
              our team are estimates. Actual timelines may vary based on
              site conditions, material availability and project scope, and
              will be confirmed as part of your project agreement.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">5. Warranty</h2>
            <p className="mt-2">
              Product warranties are as specified by the manufacturer at the
              time of purchase. Installation workmanship warranty terms are
              confirmed at the point of quotation for your specific project.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">6. Intellectual Property</h2>
            <p className="mt-2">
              All content on this website, including text, images, logos and
              design, is the property of {businessInfo.legalName} or its
              licensors and may not be reproduced without permission.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">7. Limitation of Liability</h2>
            <p className="mt-2">
              While we strive for accuracy, we make no warranties about the
              completeness or reliability of information on this website and
              are not liable for any loss arising from its use, to the
              fullest extent permitted by Kenyan law.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">8. Governing Law</h2>
            <p className="mt-2">
              These terms are governed by the laws of Kenya, and any disputes
              will be subject to the exclusive jurisdiction of the Kenyan
              courts.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">9. Contact Us</h2>
            <p className="mt-2">
              Questions about these Terms can be sent to{" "}
              <a href={`mailto:${businessInfo.email}`} className="text-primary underline underline-offset-2">
                {businessInfo.email}
              </a>{" "}
              or {businessInfo.phones[0]}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
