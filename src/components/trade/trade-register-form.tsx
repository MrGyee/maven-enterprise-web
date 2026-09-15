"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { tradeApplicationSchema, tradeBusinessTypes, type TradeApplicationValues } from "@/lib/validation/forms";
import { submitTradeApplication } from "@/app/actions/trade";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function TradeRegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TradeApplicationValues>({ resolver: zodResolver(tradeApplicationSchema) });

  const businessType = watch("businessType");

  async function onSubmit(values: TradeApplicationValues) {
    setSubmitting(true);
    const result = await submitTradeApplication(values);
    setSubmitting(false);
    if (result.success) {
      router.push(`/thank-you?ref=${encodeURIComponent(result.reference)}&type=trade`);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Company Name" htmlFor="trade-company" error={errors.companyName?.message}>
          <Input id="trade-company" {...register("companyName")} />
        </FormField>
        <FormField label="Contact Person" htmlFor="trade-contact" error={errors.contactPerson?.message}>
          <Input id="trade-contact" {...register("contactPerson")} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone Number" htmlFor="trade-phone" error={errors.phone?.message}>
          <Input id="trade-phone" {...register("phone")} />
        </FormField>
        <FormField label="Email Address" htmlFor="trade-email" error={errors.email?.message}>
          <Input id="trade-email" type="email" {...register("email")} />
        </FormField>
      </div>
      <FormField
        label="Business Type"
        htmlFor="trade-business-type"
        error={errors.businessType ? "Please select a business type." : undefined}
      >
        <Select value={businessType} onValueChange={(v) => setValue("businessType", v as TradeApplicationValues["businessType"])}>
          <SelectTrigger id="trade-business-type" className="w-full">
            <SelectValue placeholder="Select a business type" />
          </SelectTrigger>
          <SelectContent>
            {tradeBusinessTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Years in Business (optional)" htmlFor="trade-years">
          <Input id="trade-years" placeholder="e.g. 5" {...register("yearsInBusiness")} />
        </FormField>
        <FormField label="Typical Project Size (optional)" htmlFor="trade-size">
          <Input id="trade-size" placeholder="e.g. KES 500K–2M" {...register("typicalProjectSize")} />
        </FormField>
      </div>
      <FormField label="Project Locations (optional)" htmlFor="trade-locations">
        <Input id="trade-locations" placeholder="e.g. Nairobi, Kiambu, Mombasa" {...register("projectLocations")} />
      </FormField>
      <FormField label="Products of Interest (optional)" htmlFor="trade-products">
        <Input id="trade-products" placeholder="e.g. Flooring, sanitary ware, kitchen fittings" {...register("productsOfInterest")} />
      </FormField>
      <Button type="submit" size="lg" disabled={submitting} className="mt-2">
        {submitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
