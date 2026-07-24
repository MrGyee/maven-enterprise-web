"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { TeamMemberAdminValues } from "@/lib/validation/admin";
import { createTeamMember, updateTeamMember } from "@/app/actions/admin/team";
import type { TeamMember } from "@/lib/data/types";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export function TeamMemberForm({ member }: { member?: TeamMember }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<TeamMemberAdminValues>({
    defaultValues: member ?? { id: "", name: "", role: "", bio: "", image: { url: "", alt: "" } },
  });

  const image = watch("image");
  const name = watch("name");

  async function onSubmit(values: TeamMemberAdminValues) {
    setIsSubmitting(true);
    const result = member
      ? await updateTeamMember(member.id, values)
      : await createTeamMember(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(member ? "Team member updated." : "Team member created.");
      router.push("/admin/team");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 pb-16 sm:max-w-md">
      <FormField label="Name" htmlFor="name">
        <Input id="name" {...register("name")} />
      </FormField>
      <FormField label="Role" htmlFor="role">
        <Input id="role" {...register("role")} />
      </FormField>
      <FormField label="Bio" htmlFor="bio">
        <Textarea id="bio" rows={4} {...register("bio")} />
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
        {isSubmitting ? "Saving..." : member ? "Save Changes" : "Create Team Member"}
      </Button>
    </form>
  );
}
