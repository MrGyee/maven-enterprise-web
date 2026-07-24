"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { ServiceAdminValues } from "@/lib/validation/admin";
import { createService, updateService } from "@/app/actions/admin/services";
import type { Service } from "@/lib/data/types";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { ImageGalleryUploadField } from "@/components/admin/image-gallery-upload-field";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(service));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
  } = useForm<ServiceAdminValues>({
    defaultValues: service ?? {
      slug: "",
      name: "",
      shortDescription: "",
      description: "",
      heroImage: { url: "", alt: "" },
      benefits: [],
      gallery: [],
      process: [{ title: "", description: "" }],
      featured: false,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "process" });
  const heroImage = watch("heroImage");
  const gallery = watch("gallery");
  const benefitsText = watch("benefits")?.join("\n") ?? "";
  const name = watch("name");

  async function onSubmit(values: ServiceAdminValues) {
    setIsSubmitting(true);
    const result = service ? await updateService(service.slug, values) : await createService(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(service ? "Service updated." : "Service created.");
      router.push("/admin/services");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Service Name" htmlFor="name">
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
      </div>

      <FormField label="Short Description" htmlFor="shortDescription">
        <Textarea id="shortDescription" rows={2} {...register("shortDescription")} />
      </FormField>
      <FormField label="Full Description" htmlFor="description">
        <Textarea id="description" rows={4} {...register("description")} />
      </FormField>

      <ImageUploadField
        label="Hero Image"
        value={heroImage?.url ?? ""}
        onChange={(url) => setValue("heroImage", { url, alt: heroImage?.alt || name })}
      />
      <FormField label="Hero Image Alt Text" htmlFor="heroImageAlt">
        <Input id="heroImageAlt" {...register("heroImage.alt")} />
      </FormField>

      <FormField label="Benefits (one per line)" htmlFor="benefits">
        <Textarea
          id="benefits"
          rows={4}
          defaultValue={benefitsText}
          onChange={(e) =>
            setValue("benefits", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
          }
        />
      </FormField>

      <ImageGalleryUploadField label="Gallery" value={gallery} onChange={(next) => setValue("gallery", next)} />

      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Process Steps</span>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ title: "", description: "" })}>
            <Plus className="size-3.5" />
            Add Step
          </Button>
        </div>
        <div className="mt-3 grid gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-[1fr_2fr_auto]">
              <FormField label="Title" htmlFor={`step-title-${index}`}>
                <Input id={`step-title-${index}`} {...register(`process.${index}.title`)} />
              </FormField>
              <FormField label="Description" htmlFor={`step-desc-${index}`}>
                <Input id={`step-desc-${index}`} {...register(`process.${index}.description`)} />
              </FormField>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  aria-label="Remove step"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm text-foreground">
        <input type="checkbox" className="size-4" {...register("featured")} />
        Featured on homepage
      </label>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving..." : service ? "Save Changes" : "Create Service"}
      </Button>
    </form>
  );
}
