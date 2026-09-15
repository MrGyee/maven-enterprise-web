"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";

export function CartBadge({ className }: { className?: string }) {
  const { count } = useCart();

  return (
    <Link
      href="/quote-cart"
      aria-label={`Project quote cart, ${count} item${count === 1 ? "" : "s"}`}
      className={`relative flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${className ?? ""}`}
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
