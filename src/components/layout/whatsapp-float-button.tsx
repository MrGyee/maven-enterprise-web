"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsappLink, defaultWhatsappMessage } from "@/lib/whatsapp";

export function WhatsAppFloatButton({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <a
      href={buildWhatsappLink(whatsappNumber, defaultWhatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Maven Enterprise Ltd on WhatsApp"
      className="fixed bottom-8 right-8 z-40 hidden size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 md:flex"
    >
      <MessageCircle className="size-7" fill="currentColor" strokeWidth={0} />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/60" />
    </a>
  );
}
