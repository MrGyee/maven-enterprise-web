import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getBusinessInfo } from "@/lib/data/business-info";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Maven Enterprise Ltd collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: false, follow: true },
};

export default async function PrivacyPolicyPage() {
  const businessInfo = await getBusinessInfo();
  const lastUpdated = new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="pb-20">
      <Breadcrumbs items={[{ label: "Privacy Policy", href: "/privacy-policy" }]} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold" />
          <p>
            <strong>Template content.</strong> This is a generic starting
            point, not legal advice. Have a qualified lawyer review this page
            against the Kenya Data Protection Act (2019) and your actual data
            practices before relying on it.
          </p>
        </div>

        <h1 className="mt-8 font-heading text-3xl font-semibold text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">1. Introduction</h2>
            <p className="mt-2">
              {businessInfo.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your
              privacy and is committed to protecting your personal data. This
              policy explains what information we collect through our
              website, why we collect it, and how we use, store and protect
              it, in line with the Kenya Data Protection Act, 2019.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">2. Information We Collect</h2>
            <p className="mt-2">
              When you submit a quote request, contact form, bulk purchase
              inquiry, contractor registration, supplier registration, or
              newsletter signup, we collect the information you provide,
              which may include your name, phone number, email address,
              location, company name, and details about your inquiry or
              project.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">3. How We Use Your Information</h2>
            <p className="mt-2">We use the information you provide to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Respond to your quote requests, inquiries and registrations</li>
              <li>Provide customer support and follow up on your project</li>
              <li>Send you information you have requested, such as newsletters</li>
              <li>Improve our products, services and website</li>
              <li>Comply with our legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">4. Sharing of Information</h2>
            <p className="mt-2">
              We do not sell your personal information. We may share
              information with trusted service providers who help us operate
              our business (such as hosting and communication providers),
              and where required by law.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">5. WhatsApp Communication</h2>
            <p className="mt-2">
              If you choose to contact us via WhatsApp, your conversation is
              subject to WhatsApp&apos;s own privacy policy in addition to
              this one.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">6. Data Retention</h2>
            <p className="mt-2">
              We retain personal information for as long as necessary to
              fulfil the purposes described in this policy, unless a longer
              retention period is required by law.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">7. Your Rights</h2>
            <p className="mt-2">
              Under the Kenya Data Protection Act, you have the right to
              access, correct, or request deletion of your personal data, and
              to object to certain uses of it. To exercise these rights,
              contact us using the details below.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">8. Contact Us</h2>
            <p className="mt-2">
              For any questions about this Privacy Policy or your personal
              data, contact us at{" "}
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
