import { heroBannersStore } from "@/lib/store/hero-banners.store";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { HeroBannersForm } from "@/components/admin/hero-banners/hero-banners-form";

export const dynamic = "force-dynamic";

export default function AdminHeroBannersPage() {
  const banners = [...heroBannersStore.getAll()].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      <AdminListHeader
        title="Hero Banners"
        description="Manage the rotating hero images shown on the homepage."
      />
      <div className="mt-6">
        <HeroBannersForm banners={banners} />
      </div>
    </div>
  );
}
