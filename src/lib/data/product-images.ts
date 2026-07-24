import type { ImageAsset } from "./types";

// PLACEHOLDER: hotlinked Unsplash photography grouped by category, cycled
// across products for visual variety. Replace with real product photography
// (via Cloudinary) before launch.
export const categoryImagePool: Record<string, ImageAsset[]> = {
  "interior-decor": [
    { url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop", alt: "Decorative wall panelling in a modern living room" },
    { url: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop", alt: "Textured accent wall in a contemporary interior" },
    { url: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1200&auto=format&fit=crop", alt: "Elegant living room with decorative ceiling design" },
    { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop", alt: "Bright interior with patterned wallpaper feature wall" },
  ],
  flooring: [
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop", alt: "Warm wooden vinyl flooring in a living room" },
    { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop", alt: "Close-up of engineered wood flooring planks" },
    { url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop", alt: "Modern living space with light laminate flooring" },
    { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop", alt: "Neutral tiled flooring in a bright hallway" },
  ],
  bathroom: [
    { url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1200&auto=format&fit=crop", alt: "Modern bathroom with freestanding bathtub" },
    { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop", alt: "Bathroom vanity with wall-mounted basin" },
    { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop", alt: "Walk-in shower with rain shower head" },
    { url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop", alt: "Bathroom fittings and fixtures detail" },
  ],
  kitchen: [
    { url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop", alt: "Modern kitchen with green cabinetry and stone countertop" },
    { url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=1200&auto=format&fit=crop", alt: "Kitchen sink and mixer tap detail" },
    { url: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1200&auto=format&fit=crop", alt: "Fitted kitchen cabinets and countertop" },
    { url: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1200&auto=format&fit=crop", alt: "Bright modern kitchen interior" },
  ],
  lighting: [
    { url: "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?q=80&w=1200&auto=format&fit=crop", alt: "Pendant lighting fixtures above a dining table" },
    { url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1200&auto=format&fit=crop", alt: "Crystal chandelier in an elegant room" },
    { url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop", alt: "Modern wall light fixture" },
    { url: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?q=80&w=1200&auto=format&fit=crop", alt: "Warm ambient LED lighting in a living space" },
  ],
  "doors-hardware": [
    { url: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=1200&auto=format&fit=crop", alt: "Modern wooden door with brass handle" },
    { url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200&auto=format&fit=crop", alt: "Close-up of a modern door lock and handle" },
    { url: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?q=80&w=1200&auto=format&fit=crop", alt: "Interior glass panel door" },
    { url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop", alt: "Door hardware and hinge detail" },
  ],
  plumbing: [
    { url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop", alt: "Plumbing pipes and fittings installation" },
    { url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop", alt: "Water tank installation on a rooftop" },
    { url: "https://images.unsplash.com/photo-1580983561371-7f4b242d8ec0?q=80&w=1200&auto=format&fit=crop", alt: "Water heater mounted on a bathroom wall" },
    { url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop", alt: "Plumbing valves and fittings close-up" },
  ],
  "general-supplies": [
    { url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop", alt: "Interior finishing supplies and tools" },
    { url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop", alt: "Adhesives and sealants on a workbench" },
    { url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1200&auto=format&fit=crop", alt: "Assorted fixings and hardware supplies" },
    { url: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1200&auto=format&fit=crop", alt: "Installation tools laid out for a finishing project" },
  ],
};
