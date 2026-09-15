// Manually curated cross-links from a service to the calculator or product
// category most relevant to it. Left out entirely (rather than guessed) for
// services with no clear 1:1 match, e.g. consultation or project management.
export const serviceCalculatorSlug: Record<string, string> = {
  "flooring-installation": "flooring",
  "wall-panel-installation": "wall-panels",
  "wallpaper-installation": "wallpaper",
};

export const serviceProductCategorySlug: Record<string, string> = {
  "flooring-installation": "flooring",
  "kitchen-installation": "kitchen",
  "bathroom-renovation": "bathroom",
  "plumbing-installation": "plumbing",
  "wall-panel-installation": "interior-decor",
  "wallpaper-installation": "interior-decor",
  "gypsum-installation": "interior-decor",
  "pvc-ceiling-installation": "interior-decor",
};
