"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { TestimonialAdminValues } from "@/lib/validation/admin";
import { createTestimonial, updateTestimonial } from "@/app/actions/admin/testimonials";
import type { Testimonial } from "@/lib/data/types";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<TestimonialAdminValues>({
    defaultValues: testimonial ?? {
      id: "",
      name: "",
      role: "",
      company: "",
      quote: "",
      rating: 5,
      image: { url: "", alt: "" },
    },
  });

  const image = watch("image");
  const name = watch("name");

  async function onSubmit(values: TestimonialAdminValues) {
    setIsSubmitting(true);
    const result = testimonial
      ? await updateTestimonial(testimonial.id, values)
      : await createTestimonial(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(testimonial ? "Testimonial updated." : "Testimonial created.");
      router.push("/admin/testimonials");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name">
          <Input id="name" {...register("name")} />
        </FormField>
        <FormField label="Role" htmlFor="role">
          <Input id="role" {...register("role")} />
        </FormField>
      </div>
      <FormField label="Company / Location (optional)" htmlFor="company">
        <Input id="company" {...register("company")} />
      </FormField>
      <FormField label="Quote" htmlFor="quote">
        <Textarea id="quote" rows={4} {...register("quote")} />
      </FormField>
      <FormField label="Rating (1-5)" htmlFor="rating">
        <Input id="rating" type="number" min={1} max={5} {...register("rating", { valueAsNumber: true })} />
      </FormField>
      <ImageUploadField
        label="Photo"
        value={image?.url ?? ""}
        onChange={(url) => setValue("image", { url, alt: image?.alt || name })}
      />
      <FormField label="Photo Alt Text" htmlFor="imageAlt">
        <Input id="imageAlt" {...register("image.alt")} />
      </FormField>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving..." : testimonial ? "Save Changes" : "Create Testimonial"}
      </Button>
    </form>
  );
}
