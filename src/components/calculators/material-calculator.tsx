"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Calculator, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { buildCalculatorWhatsappMessage } from "@/lib/whatsapp";
import type { CalculatorProduct } from "@/lib/calculators";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { WhatsappCtaButton } from "@/components/shared/whatsapp-cta-button";

export function MaterialCalculator({
  products,
  unitName,
  whatsappNumber,
}: {
  products: CalculatorProduct[];
  unitName: "m²" | "panel" | "roll";
  whatsappNumber: string;
}) {
  const { addItem } = useCart();
  const [slug, setSlug] = useState(products[0]?.slug ?? "");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [wastage, setWastage] = useState("10");

  const product = products.find((p) => p.slug === slug);

  const result = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const wastePct = parseFloat(wastage);
    if (!product || !Number.isFinite(l) || !Number.isFinite(w) || l <= 0 || w <= 0) return null;

    const area = l * w;
    const wasteMultiplier = 1 + (Number.isFinite(wastePct) ? wastePct : 0) / 100;
    const areaWithWastage = area * wasteMultiplier;

    if (product.coverageM2) {
      const units = Math.ceil(areaWithWastage / product.coverageM2);
      return {
        area,
        quantity: units,
        quantityLabel: `${units} ${unitName}${units === 1 ? "" : "s"}`,
        cost: product.price !== undefined ? units * product.price : undefined,
      };
    }

    const quantity = Math.round(areaWithWastage * 100) / 100;
    return {
      area,
      quantity,
      quantityLabel: `${quantity} ${unitName}`,
      cost: product.price !== undefined ? quantity * product.price : undefined,
    };
  }, [product, length, width, wastage, unitName]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <FormField label="Product" htmlFor="calc-product">
          <Select value={slug} onValueChange={(v) => setSlug(v ?? "")}>
            <SelectTrigger id="calc-product" className="w-full">
              <SelectValue>{() => product?.name ?? "Select a product"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Length (m)" htmlFor="calc-length">
            <Input
              id="calc-length"
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              placeholder="e.g. 4"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </FormField>
          <FormField label="Width / Height (m)" htmlFor="calc-width">
            <Input
              id="calc-width"
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              placeholder="e.g. 3.5"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Wastage allowance (%)" htmlFor="calc-wastage">
          <Input
            id="calc-wastage"
            type="number"
            min="0"
            step="1"
            inputMode="decimal"
            value={wastage}
            onChange={(e) => setWastage(e.target.value)}
          />
        </FormField>
        <p className="-mt-2 text-xs text-muted-foreground">
          A wastage allowance covers cutting and fitting losses. 10% is a common starting point — increase it for
          rooms with lots of corners or diagonal layouts.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-secondary/50 p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <Calculator className="size-5 text-primary" />
          <h3 className="font-heading text-lg font-semibold text-foreground">Estimate</h3>
        </div>

        {product?.image && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
            <Image src={product.image} alt={product?.name ?? ""} fill sizes="400px" className="object-cover" />
          </div>
        )}

        {result ? (
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-xl bg-card p-4">
              <span className="text-sm text-muted-foreground">Area</span>
              <span className="font-heading text-base font-semibold text-foreground">{result.area.toFixed(2)} m²</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-card p-4">
              <span className="text-sm text-muted-foreground">Estimated Quantity</span>
              <span className="font-heading text-base font-semibold text-foreground">{result.quantityLabel}</span>
            </div>
            {result.cost !== undefined && (
              <div className="flex items-center justify-between rounded-xl bg-primary/10 p-4">
                <span className="text-sm font-medium text-foreground">Estimated Cost</span>
                <span className="font-heading text-lg font-semibold text-primary">
                  KES {result.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            )}

            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                className="flex-1"
                disabled={!product}
                onClick={() => {
                  if (!product) return;
                  addItem(
                    { slug: product.slug, name: product.name, image: product.image, price: product.price, priceUnit: unitName },
                    result.quantity
                  );
                }}
              >
                <ShoppingCart className="size-4" />
                Add to Project Quote
              </Button>
              <WhatsappCtaButton
                whatsappNumber={whatsappNumber}
                message={buildCalculatorWhatsappMessage(product?.name ?? "", result.quantityLabel, Number(result.area.toFixed(2)))}
                label="Ask on WhatsApp"
                variant="outline"
                className="flex-1 bg-transparent"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This is an estimate only. Actual material requirements may vary based on room layout, cutting waste
              and installation method — confirm final quantities with our team before purchase.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter your room dimensions to see an estimated quantity and cost.
          </p>
        )}
      </div>
    </div>
  );
}
