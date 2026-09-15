"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Upload, X, ArrowLeft, ArrowRight } from "lucide-react";
import {
  boqSubmissionSchema,
  boqEnquiryTypes,
  boqProjectTypes,
  boqProjectStatuses,
  boqRequirements,
  type BoqSubmissionValues,
  type BoqFile,
} from "@/lib/validation/forms";
import { kenyaCounties } from "@/lib/kenya-counties";
import { submitBoqSubmission } from "@/app/actions/boq";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";
import { buildContractorWhatsappMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const steps = [
  "What are you looking for?",
  "Project type",
  "Project location",
  "Project status",
  "Upload documents",
  "Requirements",
  "Your contact details",
] as const;

function ChoiceGrid<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-xl border p-4 text-left text-sm font-medium transition-colors",
            value === option
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-foreground hover:border-primary/40"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function BoqForm({ whatsappNumber }: { whatsappNumber: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<BoqFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<BoqSubmissionValues>({
    resolver: zodResolver(boqSubmissionSchema),
    defaultValues: { requirements: [], files: [], preferredContact: "phone" },
  });

  const values = watch();
  const [stepError, setStepError] = useState(false);

  // trigger() only reliably validates fields registered via register() —
  // the choice-grid/checkbox steps are driven by setValue() alone (custom
  // widgets, not native inputs), so those are checked manually here instead
  // of trusting the zodResolver's partial-field validation to catch them.
  async function goNext() {
    let valid = true;
    if (step === 0) valid = Boolean(values.enquiryType);
    else if (step === 1) valid = Boolean(values.projectType);
    else if (step === 3) valid = Boolean(values.projectStatus);
    else if (step === 5) valid = (values.requirements ?? []).length > 0;
    else if (step === 6) valid = await trigger(["name", "phone", "email"]);

    setStepError(!valid);
    if (!valid) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function goBack() {
    setStepError(false);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleFileSelect(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/boq-upload", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok) {
          toast.error(json.error ?? `Could not upload ${file.name}`);
          continue;
        }
        setFiles((current) => {
          const next = [...current, json as BoqFile];
          setValue("files", next);
          return next;
        });
      } catch {
        toast.error(`Could not upload ${file.name}`);
      }
    }
    setUploading(false);
  }

  function removeFile(publicId: string) {
    setFiles((current) => {
      const next = current.filter((f) => f.publicId !== publicId);
      setValue("files", next);
      return next;
    });
  }

  function toggleRequirement(requirement: (typeof boqRequirements)[number]) {
    const current = values.requirements ?? [];
    const next = current.includes(requirement)
      ? current.filter((r) => r !== requirement)
      : [...current, requirement];
    setValue("requirements", next);
    setStepError(false);
  }

  async function onSubmit(data: BoqSubmissionValues) {
    setSubmitting(true);
    const result = await submitBoqSubmission({ ...data, files });
    setSubmitting(false);
    if (result.success) {
      router.push(`/thank-you?ref=${encodeURIComponent(result.reference)}&type=boq`);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Step {step + 1} of {steps.length}
          </span>
          <span>{steps[step]}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-heading text-xl font-semibold text-foreground">{steps[step]}</h2>

          {step === 0 && (
            <div className="mt-6">
              <ChoiceGrid
                options={boqEnquiryTypes}
                value={values.enquiryType}
                onChange={(v) => {
                  setValue("enquiryType", v);
                  setStepError(false);
                }}
              />
              {stepError && step === 0 && (
                <p className="mt-2 text-xs text-destructive">Please select an option.</p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="mt-6">
              <ChoiceGrid
                options={boqProjectTypes}
                value={values.projectType}
                onChange={(v) => {
                  setValue("projectType", v);
                  setStepError(false);
                }}
              />
              {stepError && step === 1 && (
                <p className="mt-2 text-xs text-destructive">Please select an option.</p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="mt-6 grid gap-4">
              <FormField label="County" htmlFor="boq-county">
                <Select value={values.county} onValueChange={(v) => setValue("county", v ?? undefined)}>
                  <SelectTrigger id="boq-county" className="w-full">
                    <SelectValue placeholder="Select a county" />
                  </SelectTrigger>
                  <SelectContent>
                    {kenyaCounties.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Town / Area" htmlFor="boq-area">
                <Input id="boq-area" placeholder="e.g. Westlands" {...register("area")} />
              </FormField>
              <FormField label="Site Location (optional)" htmlFor="boq-site">
                <Input id="boq-site" placeholder="Building name, road, landmark" {...register("siteLocation")} />
              </FormField>
            </div>
          )}

          {step === 3 && (
            <div className="mt-6">
              <ChoiceGrid
                options={boqProjectStatuses}
                value={values.projectStatus}
                onChange={(v) => {
                  setValue("projectStatus", v);
                  setStepError(false);
                }}
              />
              {stepError && step === 3 && (
                <p className="mt-2 text-xs text-destructive">Please select an option.</p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="mt-6">
              <label
                htmlFor="boq-files"
                className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-primary/40"
              >
                <Upload className="size-6 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {uploading ? "Uploading..." : "Click to upload BOQ, drawings, photos or product list"}
                </span>
                <span className="text-xs text-muted-foreground">PDF, XLSX, DOCX, JPG or PNG — up to 15MB each</span>
                <input
                  id="boq-files"
                  type="file"
                  multiple
                  accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png"
                  className="sr-only"
                  disabled={uploading}
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </label>
              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((file) => (
                    <li
                      key={file.publicId}
                      className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      <span className="truncate text-foreground">{file.originalName}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(file.publicId)}
                        aria-label={`Remove ${file.originalName}`}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Optional — you can also just tell us what you need in the notes below, or skip this step.
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="mt-6">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {boqRequirements.map((requirement) => (
                  <label
                    key={requirement}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border p-4 text-sm font-medium transition-colors",
                      (values.requirements ?? []).includes(requirement)
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-foreground hover:border-primary/40"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="size-4"
                      checked={(values.requirements ?? []).includes(requirement)}
                      onChange={() => toggleRequirement(requirement)}
                    />
                    {requirement}
                  </label>
                ))}
              </div>
              {stepError && step === 5 && (
                <p className="mt-2 text-xs text-destructive">Select at least one requirement.</p>
              )}
              <FormField label="Notes (optional)" htmlFor="boq-notes">
                <Textarea id="boq-notes" rows={3} className="mt-4" {...register("notes")} />
              </FormField>
            </div>
          )}

          {step === 6 && (
            <div className="mt-6 grid gap-4">
              <FormField label="Full Name" htmlFor="boq-name" error={errors.name?.message}>
                <Input id="boq-name" {...register("name")} />
              </FormField>
              <FormField label="Company (optional)" htmlFor="boq-company">
                <Input id="boq-company" {...register("company")} />
              </FormField>
              <FormField label="Phone / WhatsApp" htmlFor="boq-phone" error={errors.phone?.message}>
                <Input id="boq-phone" {...register("phone")} />
              </FormField>
              <FormField label="Email Address" htmlFor="boq-email" error={errors.email?.message}>
                <Input id="boq-email" type="email" {...register("email")} />
              </FormField>
              <FormField label="Preferred Contact Method" htmlFor="boq-preferred">
                <Select
                  value={values.preferredContact}
                  onValueChange={(v) => setValue("preferredContact", v as BoqSubmissionValues["preferredContact"])}
                >
                  <SelectTrigger id="boq-preferred" className="w-full">
                    <SelectValue>
                      {() =>
                        ({ phone: "Phone Call", whatsapp: "WhatsApp", email: "Email" })[values.preferredContact]
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button type="button" size="lg" onClick={goNext}>
              Continue
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  Submit Project Request
                </>
              )}
            </Button>
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Prefer to talk it through?{" "}
        <WhatsappCtaButton
          whatsappNumber={whatsappNumber}
          message={buildContractorWhatsappMessage()}
          label="WhatsApp a Maven Project Specialist"
          variant="link"
          className="h-auto p-0 text-primary underline-offset-4 hover:underline"
        />
      </p>
    </div>
  );
}
