import { getCategories } from "@/lib/data/categories";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { ProductForm } from "@/components/admin/products/product-form";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  const categories = getCategories();
  return (
    <div>
      <AdminListHeader title="Add Product" description="Create a new product in the catalogue." />
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
