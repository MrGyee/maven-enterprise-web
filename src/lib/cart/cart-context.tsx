"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { CartItem } from "@/lib/cart/types";

const STORAGE_KEY = "maven_project_quote_cart";

interface CartContextValue {
  items: CartItem[];
  count: number;
  estimatedTotal: number | null;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// Anonymous, per-visitor cart — persisted to localStorage rather than the
// database, since there's no customer-account system to attach it to (only
// the admin has an authenticated identity). Starts empty on both server and
// client render to avoid a hydration mismatch, then reconciles with
// whatever's in localStorage right after mount.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable post-mount; see cookie-consent.tsx for the same pattern.
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // Corrupt or inaccessible storage — start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private browsing, quota) — cart still works
      // for the current page load, it just won't persist across reloads.
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.slug === item.slug);
      if (existing) {
        return current.map((i) =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...current, { ...item, quantity }];
    });
    toast.success(`${item.name} added to your project quote`);
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((current) => current.filter((i) => i.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((current) =>
      current.map((i) => (i.slug === slug ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const estimatedTotal = useMemo(() => {
    if (items.length === 0 || items.some((i) => i.price === undefined)) return null;
    return items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);
  }, [items]);

  const value = useMemo(
    () => ({ items, count, estimatedTotal, addItem, removeItem, setQuantity, clear }),
    [items, count, estimatedTotal, addItem, removeItem, setQuantity, clear]
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
