"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { BlogPostAdminValues } from "@/lib/validation/admin";
import { createBlogPost, updateBlogPost } from "@/app/actions/admin/blog";
import type { BlogPost } from "@/lib/data/types";
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

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(post));

  const { register, handleSubmit, watch, setValue } = useForm<BlogPostAdminValues>({
    defaultValues: post ?? {
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      category: "",
      tags: [],
      coverImage: { url: "", alt: "" },
      author: "",
      publishedAt: new Date().toISOString().slice(0, 10),
      readTimeMinutes: 5,
      seoDescription: "",
      status: "draft",
    },
  });

  const coverImage = watch("coverImage");
  const title = watch("title");
  const tagsText = watch("tags")?.join(", ") ?? "";

  async function onSubmit(values: BlogPostAdminValues) {
    setIsSubmitting(true);
    const result = post ? await updateBlogPost(post.slug, values) : await createBlogPost(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(post ? "Blog post updated." : "Blog post created.");
      router.push("/admin/blog");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:grid-cols-3">
      <div className="grid gap-4 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title">
            <Input
              id="title"
              {...register("title", {
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

        <FormField label="Excerpt" htmlFor="excerpt">
          <Textarea id="excerpt" rows={2} {...register("excerpt")} />
        </FormField>

        <FormField label="Content (paragraphs separated by a blank line)" htmlFor="content">
          <Textarea id="content" rows={14} {...register("content")} />
        </FormField>

        <FormField label="SEO Description" htmlFor="seoDescription">
          <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
        </FormField>

        <ImageUploadField
          label="Cover Image"
          value={coverImage?.url ?? ""}
          onChange={(url) => setValue("coverImage", { url, alt: coverImage?.alt || title })}
        />
        <FormField label="Cover Image Alt Text" htmlFor="coverImageAlt">
          <Input id="coverImageAlt" {...register("coverImage.alt")} />
        </FormField>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-4 rounded-xl border border-border p-4">
          <FormField label="Status" htmlFor="status">
            <select id="status" className={selectClassName} {...register("status")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </FormField>
          <FormField label="Category" htmlFor="category">
            <Input id="category" {...register("category")} />
          </FormField>
          <FormField label="Tags (comma separated)" htmlFor="tags">
            <Input
              id="tags"
              defaultValue={tagsText}
              onChange={(e) =>
                setValue(
                  "tags",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                )
              }
            />
          </FormField>
          <FormField label="Author" htmlFor="author">
            <Input id="author" {...register("author")} />
          </FormField>
          <FormField label="Publish Date" htmlFor="publishedAt">
            <Input id="publishedAt" type="date" {...register("publishedAt")} />
          </FormField>
          <FormField label="Read Time (minutes)" htmlFor="readTimeMinutes">
            <Input
              id="readTimeMinutes"
              type="number"
              min={1}
              {...register("readTimeMinutes", { valueAsNumber: true })}
            />
          </FormField>
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : post ? "Save Changes" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
