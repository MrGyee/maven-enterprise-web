"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { BusinessInfoAdminValues } from "@/lib/validation/admin";
import { updateBusinessInfo } from "@/app/actions/admin/business-info";
import type { BusinessInfo } from "@/lib/data/types";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function BusinessInfoForm({ businessInfo }: { businessInfo: BusinessInfo }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, control } =
    useForm<BusinessInfoAdminValues>({ defaultValues: businessInfo });

  const { fields, append, remove } = useFieldArray({ control, name: "hours" });
  const phonesText = watch("phones")?.join("\n") ?? "";
  const serviceAreasText = watch("serviceAreas")?.join("\n") ?? "";

  async function onSubmit(values: BusinessInfoAdminValues) {
    setIsSubmitting(true);
    const result = await updateBusinessInfo(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success("Business info updated.");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 pb-16 lg:max-w-3xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Legal Name" htmlFor="legalName">
          <Input id="legalName" {...register("legalName")} />
        </FormField>
        <FormField label="Tagline" htmlFor="tagline">
          <Input id="tagline" {...register("tagline")} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone Numbers (one per line)" htmlFor="phones">
          <Textarea
            id="phones"
            rows={2}
            defaultValue={phonesText}
            onChange={(e) =>
              setValue("phones", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
            }
          />
        </FormField>
        <FormField label="WhatsApp Number (digits only, e.g. 254700123456)" htmlFor="whatsappNumber">
          <Input id="whatsappNumber" {...register("whatsappNumber")} />
        </FormField>
      </div>

      <FormField label="Email" htmlFor="email">
        <Input id="email" type="email" {...register("email")} />
      </FormField>

      <div>
        <span className="text-sm font-medium text-foreground">Address</span>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <FormField label="Street" htmlFor="street">
            <Input id="street" {...register("address.street")} />
          </FormField>
          <FormField label="Area" htmlFor="area">
            <Input id="area" {...register("address.area")} />
          </FormField>
          <FormField label="City" htmlFor="city">
            <Input id="city" {...register("address.city")} />
          </FormField>
          <FormField label="Country" htmlFor="country">
            <Input id="country" {...register("address.country")} />
          </FormField>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Business Hours</span>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ days: "", time: "" })}>
            <Plus className="size-3.5" />
            Add Row
          </Button>
        </div>
        <div className="mt-3 grid gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <Input placeholder="e.g. Monday – Friday" {...register(`hours.${index}.days`)} />
              <Input placeholder="e.g. 8:00 AM – 6:00 PM" {...register(`hours.${index}.time`)} />
              <Button type="button" variant="destructive" size="icon-sm" onClick={() => remove(index)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-foreground">Social Links</span>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <FormField label="Facebook" htmlFor="facebook">
            <Input id="facebook" {...register("socials.facebook")} />
          </FormField>
          <FormField label="Instagram" htmlFor="instagram">
            <Input id="instagram" {...register("socials.instagram")} />
          </FormField>
          <FormField label="X (Twitter)" htmlFor="twitter">
            <Input id="twitter" {...register("socials.twitter")} />
          </FormField>
          <FormField label="LinkedIn" htmlFor="linkedin">
            <Input id="linkedin" {...register("socials.linkedin")} />
          </FormField>
          <FormField label="TikTok" htmlFor="tiktok">
            <Input id="tiktok" {...register("socials.tiktok")} />
          </FormField>
        </div>
      </div>

      <FormField label="Google Maps Embed URL" htmlFor="mapEmbedUrl">
        <Textarea id="mapEmbedUrl" rows={2} {...register("mapEmbedUrl")} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Map Latitude" htmlFor="lat">
          <Input id="lat" type="number" step="any" {...register("coordinates.lat", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Map Longitude" htmlFor="lng">
          <Input id="lng" type="number" step="any" {...register("coordinates.lng", { valueAsNumber: true })} />
        </FormField>
      </div>

      <FormField label="Service Areas (one per line)" htmlFor="serviceAreas">
        <Textarea
          id="serviceAreas"
          rows={4}
          defaultValue={serviceAreasText}
          onChange={(e) =>
            setValue("serviceAreas", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
          }
        />
      </FormField>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving..." : "Save Business Info"}
      </Button>
    </form>
  );
}
