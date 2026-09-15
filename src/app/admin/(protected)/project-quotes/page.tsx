import { getProjectQuoteRequests } from "@/lib/data/project-quotes";
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

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  new: "default",
  reviewing: "secondary",
  quoted: "secondary",
  closed: "destructive",
};

export default async function AdminProjectQuotesPage() {
  const quotes = await getProjectQuoteRequests();

  return (
    <div>
      <AdminListHeader
        title="Project Quotes"
        description={`${quotes.length} project quote cart submissions.`}
      />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No project quotes yet.
                </TableCell>
              </TableRow>
            )}
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="whitespace-nowrap font-mono text-xs">{quote.reference}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(quote.createdAt)}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {quote.name}
                  {quote.company ? <span className="text-muted-foreground"> · {quote.company}</span> : null}
                </TableCell>
                <TableCell>
                  <div className="text-muted-foreground">
                    <div>{quote.phone}</div>
                    <div>{quote.email}</div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs whitespace-normal">
                  {quote.items.map((item) => `${item.name} ×${item.quantity}`).join(", ")}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[quote.status] ?? "secondary"}>{quote.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
