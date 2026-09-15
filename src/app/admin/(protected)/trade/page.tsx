import Link from "next/link";
import { getTradeApplications } from "@/lib/data/trade";
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
  reviewing: "Reviewing",
  approved: "Approved",
  rejected: "Rejected",
};

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  new: "default",
  reviewing: "secondary",
  approved: "default",
  rejected: "destructive",
};

export default async function AdminTradePage() {
  const applications = await getTradeApplications();

  return (
    <div>
      <AdminListHeader title="Trade Applications" description={`${applications.length} Maven Trade applications.`} />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Business Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No trade applications yet.
                </TableCell>
              </TableRow>
            )}
            {applications.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="whitespace-nowrap">
                  <Link href={`/admin/trade/${a.id}`} className="font-mono text-xs text-primary hover:underline">
                    {a.reference}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(a.createdAt)}</TableCell>
                <TableCell className="font-medium text-foreground">{a.companyName}</TableCell>
                <TableCell className="text-muted-foreground">{a.contactPerson}</TableCell>
                <TableCell className="text-muted-foreground">{a.businessType}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[a.status] ?? "secondary"}>{statusLabel[a.status] ?? a.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
