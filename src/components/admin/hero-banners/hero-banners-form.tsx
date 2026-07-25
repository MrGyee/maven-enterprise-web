"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { HeroBannerAdminValues } from "@/lib/validation/admin";
import { updateHeroBanners } from "@/app/actions/admin/hero-banners";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export function HeroBannersForm({ banners }: { banners: HeroBannerAdminValues[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, control } = useForm<{
    banners: HeroBannerAdminValues[];
  }>({
    defaultValues: { banners },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "banners" });

  async function onSubmit(values: { banners: HeroBannerAdminValues[] }) {
    setIsSubmitting(true);
    const withOrder = values.banners.map((b, i) => ({ ...b, sortOrder: i }));
    const result = await updateHeroBanners(withOrder);
    setIsSubmitting(false);
    if (result.success) {
      toast.success("Hero banners updated.");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field, index) => {
          const image = watch(`banners.${index}`);
          return (
            <div key={field.id} className="grid gap-3 rounded-xl border border-border p-4">
              <ImageUploadField
                label={`Slide ${index + 1}`}
                value={image?.url ?? ""}
                onChange={(url) => setValue(`banners.${index}.url`, url)}
              />
              <FormField label="Alt Text" htmlFor={`alt-${index}`}>
                <Input id={`alt-${index}`} {...register(`banners.${index}.alt`)} />
              </FormField>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
              >
                <Trash2 className="size-3.5" />
                Remove Slide
              </Button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({ id: crypto.randomUUID(), url: "", alt: "", sortOrder: fields.length })
          }
        >
          <Plus className="size-3.5" />
          Add Slide
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Hero Banners"}
        </Button>
      </div>
    </form>
  );
}
