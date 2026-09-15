import type { Product } from "@/lib/data/types";

export interface CalculatorProduct {
  slug: string;
  name: string;
  image?: string;
  price?: number;
  /** Area (m²) covered by one unit (one panel, one roll). Undefined for
   * products priced continuously per m² — there, "quantity" is the area itself. */
  coverageM2?: number;
}

export function getSpecValue(product: Product, label: string): string | undefined {
  return product.specifications.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value;
}

// Parses specification strings like "500 x 500 mm", "2900 x 250 mm" or
// "0.53 x 10 m" into a coverage area in square metres. Returns null for any
// format the admin-entered spec text doesn't match, so callers can skip
// that product from the calculator rather than guess at its coverage.
export function parseCoverageAreaM2(dimensionSpec: string): number | null {
  const match = dimensionSpec.match(/^([\d.]+)\s*x\s*([\d.]+)\s*(mm|cm|m)$/i);
  if (!match) return null;
  const [, a, b, unit] = match;
  const toMeters = (n: number) => {
    if (unit.toLowerCase() === "mm") return n / 1000;
    if (unit.toLowerCase() === "cm") return n / 100;
    return n;
  };
  return toMeters(parseFloat(a)) * toMeters(parseFloat(b));
}

export interface CalculatorConfig {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  unitName: "m²" | "panel" | "roll";
  specLabel?: string; // spec field to read coverage dimensions from, e.g. "Panel size"
}

export const calculators: CalculatorConfig[] = [
  {
    slug: "flooring",
    label: "Flooring & Tiling Calculator",
    eyebrow: "Calculator",
    title: "Flooring & Tiling Calculator",
    description:
      "Estimate how much vinyl, SPC, laminate, carpet or tile flooring you need, and the approximate cost, based on your room dimensions.",
    unitName: "m²",
  },
  {
    slug: "wall-panels",
    label: "Wall Panel Calculator",
    eyebrow: "Calculator",
    title: "Wall Panel Calculator",
    description: "Estimate how many wall panels you need to cover a wall, based on each panel's real dimensions.",
    unitName: "panel",
    specLabel: "Panel size",
  },
  {
    slug: "wallpaper",
    label: "Wallpaper Calculator",
    eyebrow: "Calculator",
    title: "Wallpaper Calculator",
    description: "Estimate how many rolls of wallpaper you need to cover a wall, based on each roll's real coverage.",
    unitName: "roll",
    specLabel: "Roll size",
  },
];

export function getCalculatorConfig(slug: string) {
  return calculators.find((c) => c.slug === slug);
}
