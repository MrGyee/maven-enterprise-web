import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getBusinessInfo } from "@/lib/data/business-info";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { GoogleMapSection } from "@/components/shared/google-map-section";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ContactForm } from "@/components/contact/contact-form";
import { BulkPurchaseForm } from "@/components/contact/bulk-purchase-form";
import { ContractorRegistrationForm } from "@/components/contact/contractor-registration-form";
import { SupplierRegistrationForm } from "@/components/contact/supplier-registration-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us | Maven Enterprise Ltd Nairobi",
  description:
    "Get in touch with Maven Enterprise Ltd for interior supplies and installation services in Nairobi and across Kenya. Call, WhatsApp or send us a message.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const businessInfo = getBusinessInfo();
  return (
    <div className="pb-8">
      <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Contact Maven Enterprise Ltd"
          description="Have a question about our products or services? Reach out via phone, WhatsApp, or the form below and our team will respond promptly."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>
                    {businessInfo.address.street}, {businessInfo.address.city}, {businessInfo.address.country}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>{businessInfo.phones.join(" / ")}</span>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>{businessInfo.email}</span>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    {businessInfo.hours.map((h) => (
                      <p key={h.days}>
                        {h.days}: {h.time}
                      </p>
                    ))}
                  </div>
                </li>
              </ul>
              <WhatsappCtaButton
                whatsappNumber={businessInfo.whatsappNumber}
                label="Chat on WhatsApp"
                message="Hello Maven Enterprise Ltd. I would like to inquire about your products and services."
                className="mt-6 w-full"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-3">
            <Tabs defaultValue="contact">
              <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-secondary p-1">
                <TabsTrigger value="contact">General Inquiry</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Purchase</TabsTrigger>
                <TabsTrigger value="contractor">Contractor Registration</TabsTrigger>
                <TabsTrigger value="supplier">Supplier Registration</TabsTrigger>
              </TabsList>
              <TabsContent value="contact" className="mt-6">
                <ContactForm whatsappNumber={businessInfo.whatsappNumber} />
              </TabsContent>
              <TabsContent value="bulk" className="mt-6">
                <BulkPurchaseForm whatsappNumber={businessInfo.whatsappNumber} />
              </TabsContent>
              <TabsContent value="contractor" className="mt-6">
                <ContractorRegistrationForm whatsappNumber={businessInfo.whatsappNumber} />
              </TabsContent>
              <TabsContent value="supplier" className="mt-6">
                <SupplierRegistrationForm whatsappNumber={businessInfo.whatsappNumber} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <GoogleMapSection />
    </div>
  );
}
