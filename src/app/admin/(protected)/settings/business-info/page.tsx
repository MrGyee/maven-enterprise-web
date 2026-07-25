import { getBusinessInfo } from "@/lib/data/business-info";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { BusinessInfoForm } from "@/components/admin/settings/business-info-form";

export const dynamic = "force-dynamic";

export default function AdminBusinessInfoPage() {
  const businessInfo = getBusinessInfo();

  return (
    <div>
      <AdminListHeader
        title="Business Info"
        description="Contact details, hours and socials shown across the site."
      />
      <div className="mt-6">
        <BusinessInfoForm businessInfo={businessInfo} />
      </div>
    </div>
  );
}
