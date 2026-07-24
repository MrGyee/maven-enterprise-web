"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { categoryAdminSchema, type CategoryAdminValues } from "@/lib/validation/admin";
import { createCategory, updateCategory } from "@/app/actions/admin/categories";
import type { Category } from "@/lib/data/types";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(category));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CategoryAdminValues>({
    resolver: zodResolver(categoryAdminSchema),
    defaultValues: category ?? {
      slug: "",
      name: "",
      description: "",
      heroImage: { url: "", alt: "" },
      subcategories: [{ slug: "", name: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "subcategories" });
  const heroImage = watch("heroImage");

  async function onSubmit(values: CategoryAdminValues) {
    setIsSubmitting(true);
    const result = category
      ? await updateCategory(category.slug, values)
      : await createCategory(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(category ? "Category updated." : "Category created.");
      router.push("/admin/categories");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Category Name" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            {...register("name", {
              onChange: (e) => {
                if (!slugEdited) setValue("slug", slugify(e.target.value));
              },
            })}
          />
        </FormField>
        <FormField label="Slug" htmlFor="slug" error={errors.slug?.message}>
          <Input id="slug" {...register("slug", { onChange: () => setSlugEdited(true) })} />
        </FormField>
      </div>

      <FormField label="Description" htmlFor="description" error={errors.description?.message}>
        <Textarea id="description" rows={3} {...register("description")} />
      </FormField>

      <ImageUploadField
        label="Hero Image"
        value={heroImage?.url ?? ""}
        onChange={(url) => setValue("heroImage", { url, alt: heroImage?.alt || watch("name") })}
      />
      <FormField label="Hero Image Alt Text" htmlFor="heroImageAlt" error={errors.heroImage?.alt?.message}>
        <Input id="heroImageAlt" {...register("heroImage.alt")} />
      </FormField>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Subcategories</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ slug: "", name: "", description: "" })}
          >
            <Plus className="size-3.5" />
            Add Subcategory
          </Button>
        </div>
        {errors.subcategories?.message && (
          <p className="mt-1 text-xs text-destructive">{errors.subcategories.message}</p>
        )}
        <div className="mt-3 grid gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-[1fr_1fr_auto]">
              <FormField
                label="Name"
                htmlFor={`sub-name-${index}`}
                error={errors.subcategories?.[index]?.name?.message}
              >
                <Input
                  id={`sub-name-${index}`}
                  {...register(`subcategories.${index}.name`, {
                    onChange: (e) =>
                      setValue(`subcategories.${index}.slug`, slugify(e.target.value)),
                  })}
                />
              </FormField>
              <FormField
                label="Description"
                htmlFor={`sub-desc-${index}`}
                error={errors.subcategories?.[index]?.description?.message}
              >
                <Input id={`sub-desc-${index}`} {...register(`subcategories.${index}.description`)} />
              </FormField>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  aria-label="Remove subcategory"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving..." : category ? "Save Changes" : "Create Category"}
      </Button>
    </form>
  );
}
