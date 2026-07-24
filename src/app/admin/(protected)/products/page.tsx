import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProduct } from "@/app/actions/admin/products";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  const products = getProducts();

  return (
    <div>
      <AdminListHeader
        title="Products"
        description={`${products.length} products in the catalogue.`}
        newHref="/admin/products/new"
        newLabel="Add Product"
      />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.slug}>
                <TableCell>
                  {product.images[0] && (
                    <div className="relative size-10 overflow-hidden rounded-md">
                      <Image src={product.images[0].url} alt={product.images[0].alt} fill className="object-cover" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {product.categorySlug} / {product.subcategorySlug}
                </TableCell>
                <TableCell>{product.price ? `KES ${product.price.toLocaleString()}` : "—"}</TableCell>
                <TableCell>
                  <Badge variant={product.stockStatus === "out_of_stock" ? "destructive" : "secondary"}>
                    {product.stockStatus.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.slug}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteProduct.bind(null, product.slug)} />
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
