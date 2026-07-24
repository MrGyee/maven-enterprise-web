import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/lib/data/brands";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { BrandForm } from "@/components/admin/brands/brand-form";

export const dynamic = "force-dynamic";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  return (
    <div>
      <AdminListHeader title={`Edit ${brand.name}`} description="Update this brand." />
      <div className="mt-6">
        <BrandForm brand={brand} />
      </div>
    </div>
  );
}
