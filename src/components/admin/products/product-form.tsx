"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ProductAdminValues } from "@/lib/validation/admin";
import { createProduct, updateProduct } from "@/app/actions/admin/products";
import type { Category, Product } from "@/lib/data/types";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageGalleryUploadField } from "@/components/admin/image-gallery-upload-field";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(product));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductAdminValues>({
    defaultValues: product
      ? { ...product, features: product.features, specifications: product.specifications }
      : {
          slug: "",
          name: "",
          categorySlug: categories[0]?.slug ?? "",
          subcategorySlug: categories[0]?.subcategories[0]?.slug ?? "",
          shortDescription: "",
          description: "",
          images: [],
          features: [],
          specifications: [],
          stockStatus: "in_stock",
          installationAvailable: false,
          featured: false,
        },
  });

  const categorySlug = watch("categorySlug");
  const images = watch("images");
  const featuresText = watch("features")?.join("\n") ?? "";
  const specsText = (watch("specifications") ?? [])
    .map((s) => `${s.label}: ${s.value}`)
    .join("\n");
  const currentCategory = categories.find((c) => c.slug === categorySlug);

  async function onSubmit(values: ProductAdminValues) {
    setIsSubmitting(true);
    const sanitized = {
      ...values,
      price: typeof values.price === "number" && Number.isNaN(values.price) ? undefined : values.price,
    };
    const result = product
      ? await updateProduct(product.slug, sanitized)
      : await createProduct(sanitized);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(product ? "Product updated." : "Product created.");
      router.push("/admin/products");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:grid-cols-3">
      <div className="grid gap-4 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Product Name" htmlFor="name" error={errors.name?.message}>
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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Category" htmlFor="categorySlug" error={errors.categorySlug?.message}>
            <select
              id="categorySlug"
              className={selectClassName}
              {...register("categorySlug", {
                onChange: (e) => {
                  const nextCategory = categories.find((c) => c.slug === e.target.value);
                  setValue("subcategorySlug", nextCategory?.subcategories[0]?.slug ?? "");
                },
              })}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Subcategory" htmlFor="subcategorySlug" error={errors.subcategorySlug?.message}>
            <select id="subcategorySlug" className={selectClassName} {...register("subcategorySlug")}>
              {currentCategory?.subcategories.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Short Description" htmlFor="shortDescription" error={errors.shortDescription?.message}>
          <Textarea id="shortDescription" rows={2} {...register("shortDescription")} />
        </FormField>
        <FormField label="Full Description" htmlFor="description" error={errors.description?.message}>
          <Textarea id="description" rows={5} {...register("description")} />
        </FormField>

        <FormField label="Features (one per line)" htmlFor="features">
          <Textarea
            id="features"
            rows={4}
            defaultValue={featuresText}
            onChange={(e) =>
              setValue(
                "features",
                e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </FormField>

        <FormField label="Specifications (one per line, format: Label: Value)" htmlFor="specifications">
          <Textarea
            id="specifications"
            rows={4}
            defaultValue={specsText}
            onChange={(e) =>
              setValue(
                "specifications",
                e.target.value
                  .split("\n")
                  .map((line) => {
                    const [label, ...rest] = line.split(":");
                    return { label: label?.trim() ?? "", value: rest.join(":").trim() };
                  })
                  .filter((s) => s.label && s.value)
              )
            }
          />
        </FormField>

        <ImageGalleryUploadField
          label="Product Images"
          value={images}
          onChange={(next) => setValue("images", next)}
        />
      </div>

      <div className="grid gap-4">
        <div className="grid gap-4 rounded-xl border border-border p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Price (KES, optional)" htmlFor="price" error={errors.price?.message}>
              <Input id="price" type="number" step="1" {...register("price", { valueAsNumber: true })} />
            </FormField>
            <FormField label="Price Unit (optional)" htmlFor="priceUnit">
              <Input id="priceUnit" placeholder="e.g. per m²" {...register("priceUnit")} />
            </FormField>
          </div>
          <FormField label="Stock Status" htmlFor="stockStatus">
            <select id="stockStatus" className={selectClassName} {...register("stockStatus")}>
              <option value="in_stock">In Stock</option>
              <option value="made_to_order">Made to Order</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </FormField>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" className="size-4" {...register("installationAvailable")} />
            Installation available
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" className="size-4" {...register("featured")} />
            Featured on homepage
          </label>
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : product ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
