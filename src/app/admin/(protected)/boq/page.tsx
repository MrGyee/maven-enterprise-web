import Link from "next/link";
import { getBoqSubmissions } from "@/lib/data/boq";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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

const statusLabel: Record<string, string> = {
  new: "New",
  under_review: "Under Review",
  pricing: "Pricing",
  quote_sent: "Quote Sent",
  customer_reviewing: "Customer Reviewing",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
};

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  new: "default",
  under_review: "secondary",
  pricing: "secondary",
  quote_sent: "secondary",
  customer_reviewing: "secondary",
  approved: "default",
  rejected: "destructive",
  completed: "default",
};

export default async function AdminBoqPage() {
  const submissions = await getBoqSubmissions();

  return (
    <div>
      <AdminListHeader title="BOQ Submissions" description={`${submissions.length} project procurement requests.`} />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No BOQ submissions yet.
                </TableCell>
              </TableRow>
            )}
            {submissions.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="whitespace-nowrap">
                  <Link href={`/admin/boq/${s.id}`} className="font-mono text-xs text-primary hover:underline">
                    {s.reference}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(s.createdAt)}</TableCell>
                <TableCell className="font-medium text-foreground">
                  {s.name}
                  {s.company ? <span className="text-muted-foreground"> · {s.company}</span> : null}
                </TableCell>
                <TableCell className="text-muted-foreground">{s.projectType}</TableCell>
                <TableCell className="text-muted-foreground">
                  {[s.area, s.county].filter(Boolean).join(", ") || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">{s.files.length}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[s.status] ?? "secondary"}>{statusLabel[s.status] ?? s.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
