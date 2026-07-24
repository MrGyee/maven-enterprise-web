import { AdminListHeader } from "@/components/admin/admin-list-header";
import { BrandForm } from "@/components/admin/brands/brand-form";

export const dynamic = "force-dynamic";

export default function NewBrandPage() {
  return (
    <div>
      <AdminListHeader title="Add Brand" description="Add a new partner brand." />
      <div className="mt-6">
        <BrandForm />
      </div>
    </div>
  );
}
