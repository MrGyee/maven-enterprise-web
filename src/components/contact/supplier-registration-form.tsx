"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supplierRegistrationSchema, type SupplierRegistrationValues } from "@/lib/validation/forms";
import { submitSupplierRegistration } from "@/app/actions/leads";
import { FormField } from "@/components/shared/form-field";
import { FormSuccess } from "@/components/shared/form-success";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function SupplierRegistrationForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupplierRegistrationValues>({ resolver: zodResolver(supplierRegistrationSchema) });

  async function onSubmit(values: SupplierRegistrationValues) {
    const result = await submitSupplierRegistration(values);
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
        whatsappMessage="Hello Maven Enterprise Ltd, I just registered as a supplier through your website and would like to follow up."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" htmlFor="supplier-name" error={errors.name?.message}>
          <Input id="supplier-name" {...register("name")} />
        </FormField>
        <FormField label="Company Name" htmlFor="supplier-company" error={errors.company?.message}>
          <Input id="supplier-company" {...register("company")} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone Number" htmlFor="supplier-phone" error={errors.phone?.message}>
          <Input id="supplier-phone" {...register("phone")} />
        </FormField>
        <FormField label="Email Address" htmlFor="supplier-email" error={errors.email?.message}>
          <Input id="supplier-email" type="email" {...register("email")} />
        </FormField>
      </div>
      <FormField label="Products Supplied" htmlFor="supplier-products" error={errors.productsSupplied?.message}>
        <Textarea id="supplier-products" rows={3} placeholder="e.g. Sanitary ware, tiles, lighting fixtures" {...register("productsSupplied")} />
      </FormField>
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Submitting..." : "Register as Supplier"}
      </Button>
    </form>
  );
}
