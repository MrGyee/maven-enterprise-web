import type { Metadata } from "next";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { isSearchConsoleConfigured, querySearchAnalytics, type SearchAnalyticsRow } from "@/lib/google-search-console";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SEO — Search Console",
  robots: { index: false, follow: false },
};

function isoDateDaysAgo(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function formatPercent(ratio: number) {
  return `${(ratio * 100).toFixed(2)}%`;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="font-heading text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function PerformanceTable({
  title,
  rows,
  labelHeader,
  formatLabel,
}: {
  title: string;
  rows: SearchAnalyticsRow[];
  labelHeader: string;
  formatLabel: (key: string) => string;
}) {
  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{labelHeader}</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Impr.</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="text-right">Position</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No data for this period.
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.keys.join("|")}>
                <TableCell className="max-w-[260px] truncate" title={row.keys[0]}>
                  {formatLabel(row.keys[0])}
                </TableCell>
                <TableCell className="text-right">{row.clicks}</TableCell>
                <TableCell className="text-right">{row.impressions}</TableCell>
                <TableCell className="text-right">{formatPercent(row.ctr)}</TableCell>
                <TableCell className="text-right">{row.position.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default async function AdminSeoPage() {
  const startDate = isoDateDaysAgo(31);
  const endDate = isoDateDaysAgo(3); // Search Console data typically lags 2-3 days.

  if (!isSearchConsoleConfigured()) {
    return (
      <div>
        <AdminListHeader
          title="SEO — Search Console"
          description="Search performance pulled directly from Google Search Console."
        />
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-6 text-sm">
          <p className="font-medium text-foreground">Not connected yet.</p>
          <p className="mt-2 text-muted-foreground">
            Add a Google Cloud service account with read access to this property in Search Console, then set these
            environment variables:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
            <li>
              <code className="rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground">
                GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL
              </code>{" "}
              — the service account&apos;s email address
            </li>
            <li>
              <code className="rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground">
                GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY
              </code>{" "}
              — its private key (with <code>\n</code> escapes for line breaks)
            </li>
            <li>
              <code className="rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground">
                GOOGLE_SEARCH_CONSOLE_SITE_URL
              </code>{" "}
              — the property identifier as it appears in Search Console (e.g.{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground">
                sc-domain:mavenenterprise.co.ke
              </code>
              )
            </li>
          </ul>
        </div>
      </div>
    );
  }

  let summary: SearchAnalyticsRow[] = [];
  let topQueries: SearchAnalyticsRow[] = [];
  let topPages: SearchAnalyticsRow[] = [];
  let fetchError: string | null = null;

  try {
    [summary, topQueries, topPages] = await Promise.all([
      querySearchAnalytics({ startDate, endDate, dimensions: [] }),
      querySearchAnalytics({ startDate, endDate, dimensions: ["query"], rowLimit: 20 }),
      querySearchAnalytics({ startDate, endDate, dimensions: ["page"], rowLimit: 20 }),
    ]);
  } catch (error) {
    fetchError = error instanceof Error ? error.message : "Failed to fetch Search Console data.";
  }

  if (fetchError) {
    return (
      <div>
        <AdminListHeader title="SEO — Search Console" description={`${startDate} to ${endDate}`} />
        <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-medium">Couldn&apos;t load Search Console data.</p>
          <p className="mt-2">{fetchError}</p>
        </div>
      </div>
    );
  }

  const totals = summary[0];
  const siteUrl = (process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL ?? "").replace(/^sc-domain:/, "https://");

  return (
    <div>
      <AdminListHeader title="SEO — Search Console" description={`Search performance, ${startDate} to ${endDate}`} />

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Clicks" value={totals?.clicks ?? 0} />
        <StatCard label="Impressions" value={totals?.impressions ?? 0} />
        <StatCard label="Avg. CTR" value={totals ? formatPercent(totals.ctr) : "—"} />
        <StatCard label="Avg. Position" value={totals ? totals.position.toFixed(1) : "—"} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <PerformanceTable title="Top Queries" rows={topQueries} labelHeader="Query" formatLabel={(key) => key} />
        <PerformanceTable
          title="Top Pages"
          rows={topPages}
          labelHeader="Page"
          formatLabel={(key) => key.replace(siteUrl, "") || "/"}
        />
      </div>
    </div>
  );
}
