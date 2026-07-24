import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloatButton } from "@/components/layout/whatsapp-float-button";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { getBusinessInfo, getLocalBusinessJsonLd } from "@/lib/data/business-info";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const businessInfo = getBusinessInfo();

  return (
    <>
      <JsonLd data={getLocalBusinessJsonLd()} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloatButton whatsappNumber={businessInfo.whatsappNumber} />
      <StickyMobileCta phoneNumber={businessInfo.phones[0]} whatsappNumber={businessInfo.whatsappNumber} />
    </>
  );
}
