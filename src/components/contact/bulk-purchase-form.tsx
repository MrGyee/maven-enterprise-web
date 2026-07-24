"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { bulkPurchaseFormSchema, type BulkPurchaseFormValues } from "@/lib/validation/forms";
import { submitBulkPurchaseInquiry } from "@/app/actions/leads";
import { FormField } from "@/components/shared/form-field";
import { FormSuccess } from "@/components/shared/form-success";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function BulkPurchaseForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BulkPurchaseFormValues>({ resolver: zodResolver(bulkPurchaseFormSchema) });

  async function onSubmit(values: BulkPurchaseFormValues) {
    const result = await submitBulkPurchaseInquiry(values);
    if (result.success) {
      setSuccess(true);
    } else {
      toast.error(result.error);
    }
  }

  if (success) {
    return (
      <FormSuccess
        whatsappNumber={whatsappNumber}
        whatsappMessage="Hello Maven Enterprise Ltd, I just submitted a bulk purchase inquiry through your website and would like to follow up."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Contact Name" htmlFor="bulk-name" error={errors.name?.message}>
          <Input id="bulk-name" {...register("name")} />
        </FormField>
        <FormField label="Company Name" htmlFor="bulk-company" error={errors.company?.message}>
          <Input id="bulk-company" {...register("company")} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone Number" htmlFor="bulk-phone" error={errors.phone?.message}>
          <Input id="bulk-phone" {...register("phone")} />
        </FormField>
        <FormField label="Email Address" htmlFor="bulk-email" error={errors.email?.message}>
          <Input id="bulk-email" type="email" {...register("email")} />
        </FormField>
      </div>
      <FormField label="Products Needed" htmlFor="bulk-products" error={errors.productsNeeded?.message}>
        <Textarea id="bulk-products" rows={3} placeholder="e.g. SPC flooring, kitchen sinks, LED downlights" {...register("productsNeeded")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Estimated Quantity" htmlFor="bulk-quantity" error={errors.estimatedQuantity?.message}>
          <Input id="bulk-quantity" placeholder="e.g. 500 m²" {...register("estimatedQuantity")} />
        </FormField>
        <FormField label="Delivery Location" htmlFor="bulk-location" error={errors.location?.message}>
          <Input id="bulk-location" {...register("location")} />
        </FormField>
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Sending..." : "Submit Bulk Inquiry"}
      </Button>
    </form>
  );
}
