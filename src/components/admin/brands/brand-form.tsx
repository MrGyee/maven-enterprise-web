"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { BrandAdminValues } from "@/lib/validation/admin";
import { createBrand, updateBrand } from "@/app/actions/admin/brands";
import type { Brand } from "@/lib/data/types";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BrandForm({ brand }: { brand?: Brand }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(brand));

  const { register, handleSubmit, setValue } = useForm<BrandAdminValues>({
    defaultValues: brand ?? { slug: "", name: "" },
  });

  async function onSubmit(values: BrandAdminValues) {
    setIsSubmitting(true);
    const result = brand ? await updateBrand(brand.slug, values) : await createBrand(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(brand ? "Brand updated." : "Brand created.");
      router.push("/admin/brands");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 pb-16 sm:max-w-md">
      <FormField label="Brand Name" htmlFor="name">
        <Input
          id="name"
          {...register("name", {
            onChange: (e) => {
              if (!slugEdited) setValue("slug", slugify(e.target.value));
            },
          })}
        />
      </FormField>
      <FormField label="Slug" htmlFor="slug">
        <Input id="slug" {...register("slug", { onChange: () => setSlugEdited(true) })} />
      </FormField>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving..." : brand ? "Save Changes" : "Create Brand"}
      </Button>
    </form>
  );
}
