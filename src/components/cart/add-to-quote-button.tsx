"use client";

import { ShoppingCart } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/data/types";
import type { VariantProps } from "class-variance-authority";

export function AddToQuoteButton({
  product,
  size = "default",
  variant = "default",
  className,
  label = "Add to Project Quote",
}: {
  product: Product;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
  label?: string;
}) {
  const { addItem } = useCart();

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={cn(className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
          slug: product.slug,
          name: product.name,
          image: product.images[0]?.url,
          price: product.price,
          priceUnit: product.priceUnit,
        });
      }}
    >
      <ShoppingCart className="size-4" />
      {label}
    </Button>
  );
}
