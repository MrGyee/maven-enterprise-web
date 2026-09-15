import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { getBusinessInfo } from "@/lib/data/business-info";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Project Quote",
  robots: { index: false, follow: false },
};

export default async function QuoteCartPage() {
  const businessInfo = await getBusinessInfo();
  return <CartView whatsappNumber={businessInfo.whatsappNumber} />;
}
