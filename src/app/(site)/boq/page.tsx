import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BoqForm } from "@/components/boq/boq-form";
import { getBusinessInfo } from "@/lib/data/business-info";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Submit Your BOQ | Project Quotation",
  description:
    "Send Maven Enterprise Ltd your BOQ, material schedule, drawings or product list for a project quotation across Kenya.",
  alternates: { canonical: "/boq" },
};

export default async function BoqPage() {
  const businessInfo = await getBusinessInfo();
  return (
    <div className="pb-14">
      <Breadcrumbs items={[{ label: "Trade & BOQ", href: "/boq" }]} />
      <BoqForm whatsappNumber={businessInfo.whatsappNumber} />
    </div>
  );
}
