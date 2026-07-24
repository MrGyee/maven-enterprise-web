"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/validation/forms";
import { submitQuoteRequest } from "@/app/actions/leads";
import { FormField } from "@/components/shared/form-field";
import { FormSuccess } from "@/components/shared/form-success";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function QuoteForm({
  whatsappNumber,
  onSuccess,
}: {
  whatsappNumber: string;
  onSuccess?: () => void;
}) {
  const searchParams = useSearchParams();
  const prefill = searchParams.get("product") ?? searchParams.get("service") ?? "";
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({ resolver: zodResolver(quoteFormSchema) });

  useEffect(() => {
    if (prefill) setValue("interest", prefill);
  }, [prefill, setValue]);

  async function onSubmit(values: QuoteFormValues) {
    const result = await submitQuoteRequest(values);
    if (result.success) {
      setSuccess(true);
      onSuccess?.();
    } else {
      toast.error(result.error);
    }
  }

  if (success) {
    return (
      <FormSuccess
        whatsappNumber={whatsappNumber}
        title="Quote request received!"
        description="Our team will review your request and get back to you with a tailored quotation shortly."
        whatsappMessage="Hello Maven Enterprise Ltd, I just submitted a quote request through your website and would like to follow up."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" htmlFor="quote-name" error={errors.name?.message}>
          <Input id="quote-name" {...register("name")} />
        </FormField>
        <FormField label="Phone Number" htmlFor="quote-phone" error={errors.phone?.message}>
          <Input id="quote-phone" {...register("phone")} />
        </FormField>
      </div>
      <FormField label="Email Address" htmlFor="quote-email" error={errors.email?.message}>
        <Input id="quote-email" type="email" {...register("email")} />
      </FormField>
      <FormField label="Location" htmlFor="quote-location" error={errors.location?.message}>
        <Input id="quote-location" placeholder="e.g. Westlands, Nairobi" {...register("location")} />
      </FormField>
      <FormField label="What do you need a quote for?" htmlFor="quote-interest" error={errors.interest?.message}>
        <Input id="quote-interest" placeholder="e.g. Bathroom renovation, SPC flooring" {...register("interest")} />
      </FormField>
      <FormField label="Estimated Quantity (optional)" htmlFor="quote-quantity" error={errors.quantity?.message}>
        <Input id="quote-quantity" placeholder="e.g. 40 m², 2 bathrooms" {...register("quantity")} />
      </FormField>
      <FormField label="Additional Details (optional)" htmlFor="quote-message" error={errors.message?.message}>
        <Textarea id="quote-message" rows={4} {...register("message")} />
      </FormField>
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Submitting..." : "Request Quotation"}
      </Button>
    </form>
  );
}
