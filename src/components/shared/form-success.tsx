import { CheckCircle2 } from "lucide-react";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";

export function FormSuccess({
  whatsappNumber,
  title = "Thank you — we've received your request!",
  description = "Our team will get back to you shortly. For a faster response, continue the conversation on WhatsApp.",
  whatsappMessage,
}: {
  whatsappNumber: string;
  title?: string;
  description?: string;
  whatsappMessage: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
      <CheckCircle2 className="size-10 text-primary" />
      <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      <WhatsappCtaButton
        whatsappNumber={whatsappNumber}
        label="Continue on WhatsApp"
        message={whatsappMessage}
        className="mt-2"
      />
    </div>
  );
}
