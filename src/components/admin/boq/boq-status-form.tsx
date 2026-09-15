"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateBoqSubmissionAction } from "@/app/actions/boq";
import type { BoqStatus } from "@/lib/store/boq.store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FormField } from "@/components/shared/form-field";

const statusOptions: { value: BoqStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "under_review", label: "Under Review" },
  { value: "pricing", label: "Pricing" },
  { value: "quote_sent", label: "Quote Sent" },
  { value: "customer_reviewing", label: "Customer Reviewing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
];

export function BoqStatusForm({
  id,
  status,
  assignedTo,
  adminNotes,
}: {
  id: string;
  status: BoqStatus;
  assignedTo: string | null;
  adminNotes: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    status,
    assignedTo: assignedTo ?? "",
    adminNotes: adminNotes ?? "",
  });

  function save() {
    startTransition(async () => {
      await updateBoqSubmissionAction(id, form);
      toast.success("Saved.");
    });
  }

  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="font-heading text-base font-semibold text-foreground">Manage Submission</h2>
      <FormField label="Status" htmlFor="boq-status">
        <Select
          value={form.status}
          onValueChange={(v) => setForm((f) => ({ ...f, status: v as BoqStatus }))}
        >
          <SelectTrigger id="boq-status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Assigned To" htmlFor="boq-assigned">
        <Input
          id="boq-assigned"
          value={form.assignedTo}
          onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
          placeholder="Salesperson name"
        />
      </FormField>
      <FormField label="Internal Notes" htmlFor="boq-admin-notes">
        <Textarea
          id="boq-admin-notes"
          rows={4}
          value={form.adminNotes}
          onChange={(e) => setForm((f) => ({ ...f, adminNotes: e.target.value }))}
          placeholder="Not visible to the customer."
        />
      </FormField>
      <Button type="button" onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
