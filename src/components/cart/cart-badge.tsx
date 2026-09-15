"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";

export function CartBadge({ className }: { className?: string }) {
  const { count } = useCart();
  // Quantities can be fractional (e.g. m² of flooring from a calculator), so
  // round only for this display/announcement — the cart itself keeps the
  // precise value for cost calculations.
  const displayCount = Math.round(count);

  return (
    <Link
      href="/quote-cart"
      aria-label={`Project quote cart, ${displayCount} item${displayCount === 1 ? "" : "s"}`}
      className={`relative flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${className ?? ""}`}
    >
      <ShoppingCart className="size-5" />
      {displayCount > 0 && (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {displayCount > 9 ? "9+" : displayCount}
        </span>
      )}
    </Link>
  );
}
