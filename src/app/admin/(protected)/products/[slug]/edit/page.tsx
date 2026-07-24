import { notFound } from "next/navigation";
import { getCategories } from "@/lib/data/categories";
import { getProductBySlug } from "@/lib/data/products";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { ProductForm } from "@/components/admin/products/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const categories = getCategories();

  return (
    <div>
      <AdminListHeader title={`Edit ${product.name}`} description="Update this product's details." />
      <div className="mt-6">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}
