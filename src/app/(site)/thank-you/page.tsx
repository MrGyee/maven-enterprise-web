import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Home, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";
import { cn } from "@/lib/utils";
import { getBusinessInfo } from "@/lib/data/business-info";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; type?: string }>;
}) {
  const businessInfo = await getBusinessInfo();
  const { ref, type } = await searchParams;
  const isBoq = type === "boq";
  const isTrade = type === "trade";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-8" />
      </span>
      <h1 className="mt-6 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
        {isBoq
          ? "Your project request has been received."
          : isTrade
            ? "Your Maven Trade application has been received."
            : "Thank you — your quote request is in!"}
      </h1>
      {ref && (
        <p className="mt-3 rounded-full bg-secondary px-4 py-1.5 font-mono text-sm font-semibold text-foreground">
          {ref}
        </p>
      )}
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {isBoq
          ? "Our team will review your requirements and get back to you with pricing and next steps. Keep your reference number for any follow-up."
          : isTrade
            ? "Our team will review your application and get back to you regarding your Maven Trade account. Keep your reference number for any follow-up."
            : "Our team will review your request and get back to you within 1 business day. For a faster response, continue the conversation on WhatsApp right now."}
      </p>
      <WhatsappCtaButton
        whatsappNumber={businessInfo.whatsappNumber}
        message={
          ref
            ? `Hello Maven Enterprise Ltd, I just submitted a request through your website (reference ${ref}) and would like to follow up.`
            : "Hello Maven Enterprise Ltd, I just submitted a quote request through your website and would like to follow up."
        }
        label="Continue on WhatsApp"
        className="mt-6"
      />
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-6")}>
          <Home className="size-4" />
          Back to Home
        </Link>
        <Link
          href="/products"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-6")}
        >
          <Search className="size-4" />
          Browse Products
        </Link>
      </div>
    </div>
  );
}
