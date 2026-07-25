import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Target, Eye, HeartHandshake, ArrowRight, ShieldCheck, Award } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { getTeam } from "@/lib/data/team";
import { getBrands } from "@/lib/data/brands";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | Best Interior Company in Kenya",
  description:
    "Learn about Maven Enterprise Ltd's story, mission, values and team — a trusted supplier and installer of interior finishing products across Kenya.",
  alternates: { canonical: "/about" },
};

const coreValues = [
  { title: "Quality", description: "We never compromise on the quality of the products and workmanship we deliver." },
  { title: "Integrity", description: "Transparent pricing, honest timelines and accountability on every project." },
  { title: "Reliability", description: "We show up on time and deliver on our commitments, every time." },
  { title: "Innovation", description: "We stay current with the latest interior finishing trends and technologies." },
];

const trustPoints = [
  { icon: ShieldCheck, title: "Quality Assurance", description: "All products backed by manufacturer warranties and quality checks before installation." },
  { icon: Award, title: "12+ Years of Experience", description: "Over a decade supplying and installing interior finishes across Kenya." },
  { icon: HeartHandshake, title: "Client-First Approach", description: "We tailor solutions to your budget, timeline and design preferences." },
];

export default async function AboutPage() {
  const team = await getTeam();
  const brands = await getBrands();
  return (
    <div className="pb-20">
      <Breadcrumbs items={[{ label: "About Us", href: "/about" }]} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="Our Story" title="Trusted Interior Solutions Partner in Kenya" />
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Founded over a decade ago, Maven Enterprise Ltd began as a small
              supplier of bathroom fittings in Nairobi and has grown into one
              of Kenya&apos;s trusted names in interior finishing — supplying
              and installing décor, sanitary ware, kitchen fittings, flooring,
              lighting and plumbing products for homeowners, architects,
              contractors and developers across the country.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Today, our team of designers, procurement specialists and
              installation crews work on projects ranging from single-room
              renovations to full hotel and office fit-outs, always guided by
              the same commitment to quality and service that got us started.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1200&auto=format&fit=crop"
              alt="Maven Enterprise Ltd showroom and team at work"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8">
            <Target className="size-8 text-primary" />
            <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">Our Mission</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              To make premium interior finishing accessible across Kenya by
              supplying quality products and delivering professional
              installation that homeowners and businesses can rely on.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <Eye className="size-8 text-primary" />
            <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">Our Vision</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              To be East Africa&apos;s most trusted interior supply and
              installation partner, recognised for quality, reliability and
              design excellence.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading eyebrow="What Drives Us" title="Our Core Values" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value) => (
              <div key={value.title} className="rounded-2xl bg-secondary/60 p-6 text-center">
                <h3 className="font-heading text-base font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading eyebrow="Confidence" title="Why Clients Trust Us" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {trustPoints.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading eyebrow="Our People" title="Meet the Team" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative mx-auto size-28 overflow-hidden rounded-full">
                  <Image src={member.image.url} alt={member.image.alt} fill sizes="112px" className="object-cover" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-10 sm:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Recognised" title="Certifications" />
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li>Registered member, Kenya Association of Building &amp; Civil Engineering Contractors</li>
              <li>Certified installer partner for multiple sanitary ware and flooring brands</li>
              <li>NCA-registered building materials supplier</li>
              <li>Compliant with Kenya Bureau of Standards (KEBS) product requirements</li>
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Who We Work With" title="Our Partners" />
            <div className="mt-5 flex flex-wrap gap-4">
              {brands.map((brand) => (
                <span key={brand.slug} className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground">
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center gap-4 rounded-3xl bg-primary px-8 py-14 text-center">
          <h2 className="font-heading text-2xl font-semibold text-primary-foreground sm:text-3xl">
            Let&apos;s Work on Your Next Project
          </h2>
          <Link href="/quote" className={cn(buttonVariants({ size: "lg" }), "bg-white text-primary hover:bg-white/90")}>
            Request a Free Quote
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
