import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getBusinessInfo } from "@/lib/data/business-info";
import { getCategories } from "@/lib/data/categories";
import { FacebookIcon, InstagramIcon, XIcon, LinkedinIcon, TiktokIcon } from "@/components/shared/social-icons";
import { NewsletterSignupForm } from "@/components/shared/newsletter-signup-form";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/quote", label: "Request Quotation" },
];

export function Footer() {
  const businessInfo = getBusinessInfo();
  const categories = getCategories();
  const socialLinks = [
    { href: businessInfo.socials.facebook, icon: FacebookIcon, label: "Facebook" },
    { href: businessInfo.socials.instagram, icon: InstagramIcon, label: "Instagram" },
    { href: businessInfo.socials.twitter, icon: XIcon, label: "X (Twitter)" },
    { href: businessInfo.socials.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
    { href: businessInfo.socials.tiktok, icon: TiktokIcon, label: "TikTok" },
  ];

  return (
    <footer className="border-t border-border bg-secondary/60 pb-20 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary font-heading text-lg font-semibold text-primary-foreground">
              M
            </span>
            <span className="font-heading text-lg font-semibold text-foreground">
              Maven Enterprise
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {businessInfo.tagline}. Supplying and installing premium interior
            décor, sanitary ware, kitchen fittings and plumbing products
            across Kenya.
          </p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">Quick Links</h3>
          <ul className="mt-4 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">Categories</h3>
          <ul className="mt-4 space-y-2">
            {categories.slice(0, 7).map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/products/${category.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground">Get In Touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  {businessInfo.address.street}, {businessInfo.address.city}, {businessInfo.address.country}
                </span>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{businessInfo.phones.join(" / ")}</span>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{businessInfo.email}</span>
              </li>
              <li className="flex gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  {businessInfo.hours.map((h) => `${h.days}: ${h.time}`).join(" · ")}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground">Newsletter</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get interior trends, buying guides and offers in your inbox.
            </p>
            <NewsletterSignupForm />
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Maven Enterprise Ltd. All rights reserved.</p>
          <p>Trusted Interior Solutions Partner in Kenya.</p>
        </div>
      </div>
    </footer>
  );
}
