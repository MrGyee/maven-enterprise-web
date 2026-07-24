"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ProjectAdminValues } from "@/lib/validation/admin";
import { createProject, updateProject } from "@/app/actions/admin/projects";
import type { Project } from "@/lib/data/types";
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

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(project));

  const { register, handleSubmit, watch, setValue } = useForm<ProjectAdminValues>({
    defaultValues: project ?? {
      slug: "",
      title: "",
      category: "residential",
      location: "",
      description: "",
      servicesProvided: [],
      materialsUsed: [],
      beforeImage: { url: "", alt: "" },
      afterImages: [],
      completedDate: new Date().toISOString().slice(0, 10),
      featured: false,
    },
  });

  const title = watch("title");
  const beforeImage = watch("beforeImage");
  const afterImages = watch("afterImages");
  const servicesText = watch("servicesProvided")?.join("\n") ?? "";
  const materialsText = watch("materialsUsed")?.join("\n") ?? "";

  async function onSubmit(values: ProjectAdminValues) {
    setIsSubmitting(true);
    const result = project ? await updateProject(project.slug, values) : await createProject(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(project ? "Project updated." : "Project created.");
      router.push("/admin/projects");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Project Title" htmlFor="title">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Category" htmlFor="category">
          <select id="category" className={selectClassName} {...register("category")}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="office">Office</option>
            <option value="hospitality">Hospitality</option>
            <option value="retail">Retail</option>
          </select>
        </FormField>
        <FormField label="Location" htmlFor="location">
          <Input id="location" placeholder="e.g. Karen, Nairobi" {...register("location")} />
        </FormField>
      </div>

      <FormField label="Description" htmlFor="description">
        <Textarea id="description" rows={4} {...register("description")} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Services Provided (one per line)" htmlFor="servicesProvided">
          <Textarea
            id="servicesProvided"
            rows={4}
            defaultValue={servicesText}
            onChange={(e) =>
              setValue("servicesProvided", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
            }
          />
        </FormField>
        <FormField label="Materials Used (one per line)" htmlFor="materialsUsed">
          <Textarea
            id="materialsUsed"
            rows={4}
            defaultValue={materialsText}
            onChange={(e) =>
              setValue("materialsUsed", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
            }
          />
        </FormField>
      </div>

      <FormField label="Completion Date" htmlFor="completedDate">
        <Input id="completedDate" type="date" {...register("completedDate")} />
      </FormField>

      <ImageUploadField
        label="Before Image"
        value={beforeImage?.url ?? ""}
        onChange={(url) => setValue("beforeImage", { url, alt: beforeImage?.alt || `${title} before` })}
      />
      <FormField label="Before Image Alt Text" htmlFor="beforeImageAlt">
        <Input id="beforeImageAlt" {...register("beforeImage.alt")} />
      </FormField>

      <ImageGalleryUploadField
        label="After Images"
        value={afterImages}
        onChange={(next) => setValue("afterImages", next)}
      />

      <label className="flex w-fit items-center gap-2 text-sm text-foreground">
        <input type="checkbox" className="size-4" {...register("featured")} />
        Featured on homepage
      </label>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving..." : project ? "Save Changes" : "Create Project"}
      </Button>
    </form>
  );
}
