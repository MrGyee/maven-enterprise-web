"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildWhatsappLink, defaultWhatsappMessage } from "@/lib/whatsapp";
import { QuickQuotePopup } from "@/components/quote/quick-quote-popup";
import type { ImageAsset } from "@/lib/data/types";

export function Hero({
  images: heroImages,
  whatsappNumber,
}: {
  images: ImageAsset[];
  whatsappNumber: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % heroImages.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-foreground">
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[index].url}
              alt={heroImages[index].alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-32 text-center sm:px-6 lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold backdrop-blur-md"
        >
          Trusted Interior Solutions Partner in Kenya
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          Premium Interior Supplies &amp; Professional Installation
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg"
        >
          Supplying quality interior décor, plumbing fixtures, sanitary ware,
          finishing materials and expert installation services across Kenya.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <QuickQuotePopup
            whatsappNumber={whatsappNumber}
            trigger={
              <button type="button" className={cn(buttonVariants({ size: "lg" }), "h-11 px-6 text-base")}>
                Get a Free Quote
                <ArrowRight className="size-4" />
              </button>
            }
          />
          <Link
            href="/products"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 border-white/30 bg-white/10 px-6 text-base text-white hover:bg-white/20 hover:text-white")}
          >
            Browse Products
          </Link>
          <a
            href={buildWhatsappLink(whatsappNumber, defaultWhatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "h-11 bg-[#25D366] px-6 text-base text-white hover:bg-[#1ebe57]")}
          >
            <MessageCircle className="size-4" />
            WhatsApp Us
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show hero image ${i + 1}`}
            className={cn(
              "h-1.5 w-8 rounded-full transition-colors",
              i === index ? "bg-gold" : "bg-white/30"
            )}
          />
        ))}
      </div>
    </section>
  );
}
