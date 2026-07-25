import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/data/services";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { ServiceForm } from "@/components/admin/services/service-form";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <div>
      <AdminListHeader title={`Edit ${service.name}`} description="Update this service's details." />
      <div className="mt-6">
        <ServiceForm service={service} />
      </div>
    </div>
  );
}
