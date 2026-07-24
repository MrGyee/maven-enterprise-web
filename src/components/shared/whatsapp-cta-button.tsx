import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { buttonVariants } from "@/components/ui/button";

export function WhatsappCtaButton({
  whatsappNumber,
  message,
  label = "Ask on WhatsApp",
  className,
  variant = "default",
}: {
  whatsappNumber: string;
  message: string;
  label?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}) {
  return (
    <Link
      href={buildWhatsappLink(whatsappNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant, size: "lg" }),
        variant === "default" && "bg-[#25D366] text-white hover:bg-[#1ebe57]",
        className
      )}
    >
      <MessageCircle className="size-4" />
      {label}
    </Link>
  );
}
