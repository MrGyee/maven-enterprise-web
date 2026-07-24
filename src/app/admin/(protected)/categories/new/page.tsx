import { AdminListHeader } from "@/components/admin/admin-list-header";
import { CategoryForm } from "@/components/admin/categories/category-form";

export const dynamic = "force-dynamic";

export default function NewCategoryPage() {
  return (
    <div>
      <AdminListHeader title="Add Category" description="Create a new product category." />
      <div className="mt-6">
        <CategoryForm />
      </div>
    </div>
  );
}
