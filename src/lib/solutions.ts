import type { ProjectCategory } from "@/lib/data/types";

export interface SolutionAudience {
  slug: string;
  label: string;
  navLabel: string;
  icon: "Home" | "PenTool" | "HardHat" | "Building2" | "Briefcase" | "Hotel";
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  projectCategories: ProjectCategory[];
  serviceSlugs: string[];
  testimonialKeywords: string[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export const solutionAudiences: SolutionAudience[] = [
  {
    slug: "homeowners",
    label: "Homeowners",
    navLabel: "Homeowners",
    icon: "Home",
    eyebrow: "For Homeowners",
    heroTitle: "Interior Supplies & Installation for Your Home",
    heroDescription:
      "From a single room refresh to a full home renovation, we supply and install décor, flooring, kitchen, bathroom and plumbing products for homes across Kenya.",
    projectCategories: ["residential"],
    serviceSlugs: [
      "interior-design-consultation",
      "flooring-installation",
      "kitchen-installation",
      "bathroom-renovation",
      "wall-panel-installation",
      "wallpaper-installation",
    ],
    testimonialKeywords: ["homeowner"],
    primaryCta: { label: "Get a Free Quote", href: "/quote" },
    secondaryCta: { label: "Browse Products", href: "/products" },
  },
  {
    slug: "architects-designers",
    label: "Architects & Interior Designers",
    navLabel: "Architects & Designers",
    icon: "PenTool",
    eyebrow: "For Architects & Interior Designers",
    heroTitle: "A Supply Partner That Understands Specification",
    heroDescription:
      "We work from your drawings and material specifications to source and install the right products, on schedule, for residential and commercial design projects.",
    projectCategories: [],
    serviceSlugs: [
      "interior-design-consultation",
      "supply-of-interior-materials",
      "custom-interior-solutions",
      "project-management",
    ],
    testimonialKeywords: ["architect", "interior designer"],
    primaryCta: { label: "Apply for Maven Trade", href: "/trade/register" },
    secondaryCta: { label: "Submit Your BOQ", href: "/boq" },
  },
  {
    slug: "contractors",
    label: "Contractors & Builders",
    navLabel: "Contractors & Builders",
    icon: "HardHat",
    eyebrow: "For Contractors & Builders",
    heroTitle: "Reliable Material Supply for Your Sites",
    heroDescription:
      "Bulk and project pricing, BOQ-based quotations and coordinated delivery so your sites keep moving without material delays.",
    projectCategories: [],
    serviceSlugs: [
      "supply-of-interior-materials",
      "gypsum-installation",
      "flooring-installation",
      "plumbing-installation",
      "project-management",
    ],
    testimonialKeywords: ["contractor"],
    primaryCta: { label: "Apply for Maven Trade", href: "/trade/register" },
    secondaryCta: { label: "Submit Your BOQ", href: "/boq" },
  },
  {
    slug: "developers",
    label: "Property Developers",
    navLabel: "Property Developers",
    icon: "Building2",
    eyebrow: "For Property Developers",
    heroTitle: "One Supplier for Décor, Plumbing & Kitchen Fittings",
    heroDescription:
      "Simplify procurement across your developments with a single supplier for interior finishes, coordinated supply and professional installation.",
    projectCategories: ["residential", "commercial", "office"],
    serviceSlugs: [
      "supply-of-interior-materials",
      "project-management",
      "custom-interior-solutions",
      "commercial-interior-works",
    ],
    testimonialKeywords: ["developer"],
    primaryCta: { label: "Apply for Maven Trade", href: "/trade/register" },
    secondaryCta: { label: "Submit Your BOQ", href: "/boq" },
  },
  {
    slug: "commercial-office",
    label: "Commercial & Office",
    navLabel: "Commercial & Office",
    icon: "Briefcase",
    eyebrow: "For Commercial & Office Projects",
    heroTitle: "Fit-Outs for Offices & Commercial Spaces",
    heroDescription:
      "From partitioning and ceiling works to flooring and lighting, we deliver commercial and office fit-outs for modern, brand-aligned workspaces.",
    projectCategories: ["commercial", "office", "retail"],
    serviceSlugs: ["office-fit-out", "commercial-interior-works", "project-management", "custom-interior-solutions"],
    testimonialKeywords: [],
    primaryCta: { label: "Request a Quotation", href: "/quote" },
    secondaryCta: { label: "Apply for Maven Trade", href: "/trade/register" },
  },
  {
    slug: "hospitality",
    label: "Hospitality",
    navLabel: "Hospitality",
    icon: "Hotel",
    eyebrow: "For Hospitality Projects",
    heroTitle: "Durable Finishes for Hotels & Hospitality Spaces",
    heroDescription:
      "Guest room and common area fit-outs using durable, moisture-resistant materials suited to hospitality environments across Kenya.",
    projectCategories: ["hospitality"],
    serviceSlugs: ["hotel-fit-out", "commercial-interior-works", "project-management", "custom-interior-solutions"],
    testimonialKeywords: ["hotel", "hospitality"],
    primaryCta: { label: "Request a Quotation", href: "/quote" },
    secondaryCta: { label: "Apply for Maven Trade", href: "/trade/register" },
  },
];

export function getSolutionAudience(slug: string) {
  return solutionAudiences.find((a) => a.slug === slug);
}
