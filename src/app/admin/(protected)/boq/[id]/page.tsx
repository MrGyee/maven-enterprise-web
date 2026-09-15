import { notFound } from "next/navigation";
import { FileText, Image as ImageIcon, Download } from "lucide-react";
import { getBoqSubmissionById } from "@/lib/data/boq";
import { getSignedBoqFileUrl } from "@/lib/cloudinary-signed-url";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { BoqStatusForm } from "@/components/admin/boq/boq-status-form";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminBoqDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await getBoqSubmissionById(id);
  if (!submission) notFound();

  return (
    <div>
      <AdminListHeader
        title={submission.reference}
        description={`Submitted ${formatDate(submission.createdAt)}`}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact</p>
              <p className="mt-1 font-medium text-foreground">{submission.name}</p>
              {submission.company && <p className="text-sm text-muted-foreground">{submission.company}</p>}
              <p className="text-sm text-muted-foreground">{submission.phone}</p>
              <p className="text-sm text-muted-foreground">{submission.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Prefers: {submission.preferredContact}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Project</p>
              <p className="mt-1 text-sm text-foreground">{submission.enquiryType}</p>
              <p className="text-sm text-muted-foreground">{submission.projectType}</p>
              <p className="text-sm text-muted-foreground">
                {[submission.siteLocation, submission.area, submission.county].filter(Boolean).join(", ") || "No location given"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Status: {submission.projectStatus}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requirements</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {submission.requirements.map((r) => (
                <Badge key={r} variant="secondary">{r}</Badge>
              ))}
            </div>
            {submission.notes && (
              <>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{submission.notes}</p>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Uploaded Files ({submission.files.length})
            </p>
            {submission.files.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No files uploaded.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {submission.files.map((file) => (
                  <li
                    key={file.publicId}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2 truncate text-foreground">
                      {file.resourceType === "image" ? (
                        <ImageIcon className="size-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <FileText className="size-4 shrink-0 text-muted-foreground" />
                      )}
                      {file.originalName}
                    </span>
                    <a
                      href={getSignedBoqFileUrl(file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Download className="size-3.5" />
                      View
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <BoqStatusForm
            id={submission.id}
            status={submission.status}
            assignedTo={submission.assignedTo}
            adminNotes={submission.adminNotes}
          />
        </div>
      </div>
    </div>
  );
}
