"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import type { ImageAsset } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function ProductGallery({ images, name }: { images: ImageAsset[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const current = images[active];

  if (!current) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoomOpen(true)}
        className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/10"
      >
        <Image
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
        <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow transition-opacity group-hover:opacity-100">
          <Expand className="size-4" />
        </span>
      </button>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              onClick={() => setActive(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg ring-2 transition-colors",
                index === active ? "ring-primary" : "ring-transparent hover:ring-border"
              )}
            >
              <Image src={image.url} alt={image.alt} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
            <Image src={current.url} alt={current.alt} fill sizes="90vw" className="object-contain bg-black" />
          </div>
          <span className="sr-only">{name} zoomed image</span>
        </DialogContent>
      </Dialog>
    </div>
  );
}
