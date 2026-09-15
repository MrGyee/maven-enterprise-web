"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateTradeApplicationAction } from "@/app/actions/trade";
import type { TradeApplicationStatus } from "@/lib/store/trade.store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FormField } from "@/components/shared/form-field";

const statusOptions: { value: TradeApplicationStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function TradeStatusForm({
  id,
  status,
  adminNotes,
}: {
  id: string;
  status: TradeApplicationStatus;
  adminNotes: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    status,
    adminNotes: adminNotes ?? "",
  });

  function save() {
    startTransition(async () => {
      await updateTradeApplicationAction(id, form);
      toast.success("Saved.");
    });
  }

  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="font-heading text-base font-semibold text-foreground">Manage Application</h2>
      <FormField label="Status" htmlFor="trade-status">
        <Select
          value={form.status}
          onValueChange={(v) => setForm((f) => ({ ...f, status: v as TradeApplicationStatus }))}
        >
          <SelectTrigger id="trade-status" className="w-full">
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
      <FormField label="Internal Notes" htmlFor="trade-admin-notes">
        <Textarea
          id="trade-admin-notes"
          rows={4}
          value={form.adminNotes}
          onChange={(e) => setForm((f) => ({ ...f, adminNotes: e.target.value }))}
          placeholder="Not visible to the applicant."
        />
      </FormField>
      <Button type="button" onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
