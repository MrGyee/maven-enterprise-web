import Link from "next/link";
import Image from "next/image";
import { Wrench } from "lucide-react";
import type { Product } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";

const stockLabel: Record<Product["stockStatus"], string> = {
  in_stock: "In Stock",
  made_to_order: "Made to Order",
  out_of_stock: "Out of Stock",
};

const stockVariant: Record<Product["stockStatus"], "default" | "secondary" | "destructive"> = {
  in_stock: "default",
  made_to_order: "secondary",
  out_of_stock: "destructive",
};

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  return (
    <Link
      href={`/products/${product.categorySlug}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-lg hover:shadow-foreground/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image && (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <Badge variant={stockVariant[product.stockStatus]} className="absolute left-3 top-3">
          {stockLabel[product.stockStatus]}
        </Badge>
        {product.installationAvailable && (
          <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-background/90 text-primary">
            <Wrench className="size-3.5" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-foreground">
            {product.price
              ? `KES ${product.price.toLocaleString()}${product.priceUnit ? ` ${product.priceUnit}` : ""}`
              : product.priceUnit ?? "Quote on request"}
          </span>
        </div>
      </div>
    </Link>
  );
}
