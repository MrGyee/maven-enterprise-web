"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { FaqAdminValues } from "@/lib/validation/admin";
import { createFaq, updateFaq } from "@/app/actions/admin/faqs";
import type { Faq } from "@/lib/data/types";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function FaqForm({ faq }: { faq?: Faq }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<FaqAdminValues>({
    defaultValues: faq ?? { id: "", question: "", answer: "", category: "" },
  });

  async function onSubmit(values: FaqAdminValues) {
    setIsSubmitting(true);
    const result = faq ? await updateFaq(faq.id, values) : await createFaq(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(faq ? "FAQ updated." : "FAQ created.");
      router.push("/admin/faqs");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:max-w-2xl">
      <FormField label="Question" htmlFor="question">
        <Input id="question" {...register("question")} />
      </FormField>
      <FormField label="Answer" htmlFor="answer">
        <Textarea id="answer" rows={4} {...register("answer")} />
      </FormField>
      <FormField label="Category (optional)" htmlFor="category">
        <Input id="category" {...register("category")} />
      </FormField>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving..." : faq ? "Save Changes" : "Create FAQ"}
      </Button>
    </form>
  );
}
