import Link from "next/link";
import { Pencil } from "lucide-react";
import { getCategories } from "@/lib/data/categories";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCategory } from "@/app/actions/admin/categories";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  const categories = getCategories();

  return (
    <div>
      <AdminListHeader
        title="Categories"
        description={`${categories.length} product categories.`}
        newHref="/admin/categories/new"
        newLabel="Add Category"
      />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Subcategories</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.slug}>
                <TableCell className="font-medium text-foreground">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell className="text-muted-foreground">{category.subcategories.length}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/categories/${category.slug}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteCategory.bind(null, category.slug)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
