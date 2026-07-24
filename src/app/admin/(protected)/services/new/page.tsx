import { AdminListHeader } from "@/components/admin/admin-list-header";
import { ServiceForm } from "@/components/admin/services/service-form";

export const dynamic = "force-dynamic";

export default function NewServicePage() {
  return (
    <div>
      <AdminListHeader title="Add Service" description="Create a new installation service." />
      <div className="mt-6">
        <ServiceForm />
      </div>
    </div>
  );
}
