"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { projectQuoteRequestSchema, type ProjectQuoteRequestValues } from "@/lib/validation/forms";
import { submitProjectQuoteRequest } from "@/app/actions/project-quote";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";
import { buildContractorWhatsappMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function CartView({ whatsappNumber }: { whatsappNumber: string }) {
  const { items, estimatedTotal, removeItem, setQuantity, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<ProjectQuoteRequestValues, "items">>();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Your project quote is empty</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Browse our products and add anything you need for your project — we&apos;ll put together a
          quotation for everything at once.
        </p>
        <Link href="/products" className={cn(buttonVariants({ size: "lg" }), "mt-6")}>
          Browse Products
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  async function onSubmit(values: Omit<ProjectQuoteRequestValues, "items">) {
    setSubmitting(true);
    const parsed = projectQuoteRequestSchema.safeParse({ ...values, items });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      setSubmitting(false);
      return;
    }
    const result = await submitProjectQuoteRequest(parsed.data);
    setSubmitting(false);
    if (result.success) {
      clear();
      router.push(`/thank-you?ref=${encodeURIComponent(result.reference)}`);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">My Project Quote</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Review your items, add any notes, and submit — our team will follow up with pricing and
        availability.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {items.map((item) => (
              <div key={item.slug} className="flex gap-4 p-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.price
                      ? `KES ${item.price.toLocaleString()}${item.priceUnit ? ` ${item.priceUnit}` : ""}`
                      : item.priceUnit ?? "Quote on request"}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.slug, item.quantity - 1)}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.slug, item.quantity + 1)}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug)}
                  aria-label={`Remove ${item.name}`}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
          {estimatedTotal !== null && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Estimated total</span>
              <span className="font-heading text-lg font-semibold text-foreground">
                KES {estimatedTotal.toLocaleString()}
              </span>
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Final pricing is confirmed by our team, especially for bulk or project quantities.
          </p>
        </div>

        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="font-heading text-base font-semibold text-foreground">Your Details</h2>
            <FormField label="Full Name" htmlFor="cart-name" error={errors.name?.message}>
              <Input id="cart-name" {...register("name")} />
            </FormField>
            <FormField label="Company (optional)" htmlFor="cart-company" error={errors.company?.message}>
              <Input id="cart-company" {...register("company")} />
            </FormField>
            <FormField label="Phone Number" htmlFor="cart-phone" error={errors.phone?.message}>
              <Input id="cart-phone" {...register("phone")} />
            </FormField>
            <FormField label="Email Address" htmlFor="cart-email" error={errors.email?.message}>
              <Input id="cart-email" type="email" {...register("email")} />
            </FormField>
            <FormField label="Notes (optional)" htmlFor="cart-notes" error={errors.notes?.message}>
              <Textarea
                id="cart-notes"
                rows={3}
                placeholder="Please quote alternative products if this item is unavailable."
                {...register("notes")}
              />
            </FormField>
            <Button type="submit" size="lg" disabled={submitting} className="mt-2">
              {submitting ? "Submitting..." : "Request Project Quote"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Prefer to chat?{" "}
              <WhatsappCtaButton
                whatsappNumber={whatsappNumber}
                message={buildContractorWhatsappMessage()}
                label="WhatsApp Maven"
                variant="link"
                className="h-auto p-0 text-primary underline-offset-4 hover:underline"
              />
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
