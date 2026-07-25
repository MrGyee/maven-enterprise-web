import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { whatsappLink, defaultWhatsappMessage } from "@/lib/data/business-info";

export async function CtaBanner() {
  const whatsappHref = await whatsappLink(defaultWhatsappMessage);
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center sm:px-16">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-black/10" />
        <div className="relative">
          <h2 className="font-heading text-3xl font-semibold text-primary-foreground sm:text-4xl">
            Ready to Transform Your Space?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-primary-foreground/85">
            Talk to our team today for a free, no-obligation quotation on
            products and installation services anywhere in Kenya.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/quote"
              className={cn(buttonVariants({ size: "lg" }), "h-11 bg-white px-6 text-base text-primary hover:bg-white/90")}
            >
              Get a Free Quote
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 border-white/40 bg-transparent px-6 text-base text-primary-foreground hover:bg-white/10 hover:text-primary-foreground")}
            >
              <MessageCircle className="size-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
