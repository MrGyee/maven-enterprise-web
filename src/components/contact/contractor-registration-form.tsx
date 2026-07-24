"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contractorRegistrationSchema, type ContractorRegistrationValues } from "@/lib/validation/forms";
import { submitContractorRegistration } from "@/app/actions/leads";
import { FormField } from "@/components/shared/form-field";
import { FormSuccess } from "@/components/shared/form-success";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContractorRegistrationForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContractorRegistrationValues>({ resolver: zodResolver(contractorRegistrationSchema) });

  async function onSubmit(values: ContractorRegistrationValues) {
    const result = await submitContractorRegistration(values);
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
        whatsappMessage="Hello Maven Enterprise Ltd, I just registered as a contractor through your website and would like to follow up."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" htmlFor="contractor-name" error={errors.name?.message}>
          <Input id="contractor-name" {...register("name")} />
        </FormField>
        <FormField label="Company Name" htmlFor="contractor-company" error={errors.company?.message}>
          <Input id="contractor-company" {...register("company")} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone Number" htmlFor="contractor-phone" error={errors.phone?.message}>
          <Input id="contractor-phone" {...register("phone")} />
        </FormField>
        <FormField label="Email Address" htmlFor="contractor-email" error={errors.email?.message}>
          <Input id="contractor-email" type="email" {...register("email")} />
        </FormField>
      </div>
      <FormField label="Specialization" htmlFor="contractor-specialization" error={errors.specialization?.message}>
        <Input id="contractor-specialization" placeholder="e.g. Flooring, plumbing, general fit-outs" {...register("specialization")} />
      </FormField>
      <FormField label="Years of Experience" htmlFor="contractor-experience" error={errors.yearsExperience?.message}>
        <Input id="contractor-experience" {...register("yearsExperience")} />
      </FormField>
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Submitting..." : "Register as Contractor"}
      </Button>
    </form>
  );
}
