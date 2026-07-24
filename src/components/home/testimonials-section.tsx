"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial } from "@/lib/data/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Client Stories"
          title="What Our Clients Say"
          description="Feedback from homeowners, architects, contractors and developers we've worked with across Kenya."
        />
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={scrollPrev} aria-label="Previous testimonial">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollNext} aria-label="Next testimonial">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-10 overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="min-w-0 flex-[0_0_100%] rounded-2xl border border-border bg-card p-6 sm:flex-[0_0_48%] lg:flex-[0_0_32%]"
            >
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="size-4" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="relative size-10 overflow-hidden rounded-full">
                  <Image src={testimonial.image.url} alt={testimonial.image.alt} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                    {testimonial.company ? `, ${testimonial.company}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-1.5">
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === selected ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
          />
        ))}
      </div>
    </section>
  );
}
