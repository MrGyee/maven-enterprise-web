import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/data/categories";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { CategoryForm } from "@/components/admin/categories/category-form";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div>
      <AdminListHeader title={`Edit ${category.name}`} description="Update this category's details." />
      <div className="mt-6">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
