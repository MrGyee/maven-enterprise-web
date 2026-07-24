"use client";

import { Suspense, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuoteForm } from "@/components/quote/quote-form";

export function QuickQuotePopup({
  trigger,
  whatsappNumber,
}: {
  trigger: ReactNode;
  whatsappNumber: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request a Free Quote</DialogTitle>
          <DialogDescription>
            Tell us about your project and we&apos;ll get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <Suspense>
          <QuoteForm whatsappNumber={whatsappNumber} onSuccess={() => setOpen(false)} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
