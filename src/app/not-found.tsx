import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";
import { cn } from "@/lib/utils";
import { getBusinessInfo } from "@/lib/data/business-info";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const businessInfo = await getBusinessInfo();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Image
        src="/brand-icon-master.png"
        alt="Maven Enterprise Ltd"
        width={56}
        height={56}
        className="size-14 rounded-xl"
        priority
      />
      <p className="mt-8 font-heading text-6xl font-semibold text-primary">404</p>
      <h1 className="mt-3 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        The page you&apos;re looking for may have been moved, renamed, or no
        longer exists. Try heading back home or browsing our products.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}>
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
      <p className="mt-8 text-sm text-muted-foreground">
        Still stuck? Chat with our team directly.
      </p>
      <WhatsappCtaButton
        whatsappNumber={businessInfo.whatsappNumber}
        message="Hello Maven Enterprise Ltd, I landed on a broken link on your website and could use some help finding what I need."
        label="Chat on WhatsApp"
        className="mt-3"
      />
      <Link
        href="/contact"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Or contact us <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
