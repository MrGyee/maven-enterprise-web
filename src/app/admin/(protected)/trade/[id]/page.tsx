import { notFound } from "next/navigation";
import { getTradeApplicationById } from "@/lib/data/trade";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { TradeStatusForm } from "@/components/admin/trade/trade-status-form";

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

export default async function AdminTradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getTradeApplicationById(id);
  if (!application) notFound();

  return (
    <div>
      <AdminListHeader
        title={application.reference}
        description={`Submitted ${formatDate(application.createdAt)}`}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Company</p>
              <p className="mt-1 font-medium text-foreground">{application.companyName}</p>
              <p className="text-sm text-muted-foreground">{application.contactPerson}</p>
              <p className="text-sm text-muted-foreground">{application.phone}</p>
              <p className="text-sm text-muted-foreground">{application.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Business</p>
              <p className="mt-1 text-sm text-foreground">{application.businessType}</p>
              {application.yearsInBusiness && (
                <p className="text-sm text-muted-foreground">{application.yearsInBusiness} years in business</p>
              )}
              {application.typicalProjectSize && (
                <p className="text-sm text-muted-foreground">Typical project: {application.typicalProjectSize}</p>
              )}
              {application.projectLocations && (
                <p className="text-sm text-muted-foreground">Locations: {application.projectLocations}</p>
              )}
            </div>
          </div>

          {application.productsOfInterest && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Products of Interest</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{application.productsOfInterest}</p>
            </div>
          )}
        </div>

        <div>
          <TradeStatusForm
            id={application.id}
            status={application.status}
            adminNotes={application.adminNotes}
          />
        </div>
      </div>
    </div>
  );
}
