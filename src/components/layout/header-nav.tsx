"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { CartBadge } from "@/components/cart/cart-badge";
import type { Category, Service } from "@/lib/data/types";

const trailingLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/trade", label: "Trade & BOQ" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function HeaderNav({ categories, services }: { categories: Category[]; services: Service[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname?.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand-icon-master.png"
            alt="Maven Enterprise Ltd"
            width={36}
            height={36}
            className="size-9 rounded-lg"
            priority
          />
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Maven Enterprise
          </span>
        </Link>

        <NavigationMenu className="hidden max-w-none flex-none lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/" />}
                className={cn(navigationMenuTriggerStyle(), isActive("/") && "bg-muted text-foreground")}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(isActive("/products") && "bg-muted text-foreground")}>
                Products
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[600px] p-5">
                  <div className="grid grid-cols-4 gap-3">
                    {categories.map((category) => (
                      <NavigationMenuLink
                        key={category.slug}
                        render={<Link href={`/products/${category.slug}`} />}
                        className="flex-col items-start gap-2 p-2"
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
                          <Image
                            src={category.heroImage.url}
                            alt={category.heroImage.alt}
                            fill
                            sizes="130px"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground">{category.name}</span>
                      </NavigationMenuLink>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <NavigationMenuLink
                      render={<Link href="/products" />}
                      className="inline-flex w-auto items-center gap-1 p-0 text-sm font-medium text-primary hover:bg-transparent hover:underline"
                    >
                      View All Products <ArrowRight className="size-3.5" />
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      render={<Link href="/trade" />}
                      className="inline-flex w-auto items-center gap-1 p-0 text-sm font-medium text-primary hover:bg-transparent hover:underline"
                    >
                      Trade & BOQ Pricing <ArrowRight className="size-3.5" />
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(isActive("/services") && "bg-muted text-foreground")}>
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[520px] p-5">
                  <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                    {services.map((service) => (
                      <NavigationMenuLink
                        key={service.slug}
                        render={<Link href={`/services/${service.slug}`} />}
                        className="p-2 text-sm"
                      >
                        {service.name}
                      </NavigationMenuLink>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-border pt-3">
                    <NavigationMenuLink
                      render={<Link href="/services" />}
                      className="inline-flex w-auto items-center gap-1 p-0 text-sm font-medium text-primary hover:bg-transparent hover:underline"
                    >
                      View All Services <ArrowRight className="size-3.5" />
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {trailingLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  render={<Link href={link.href} />}
                  className={cn(navigationMenuTriggerStyle(), isActive(link.href) && "bg-muted text-foreground")}
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-2 lg:flex">
          <CartBadge />
          <Link href="/quote" className={cn(buttonVariants({}), "ml-2")}>
            Request Quotation
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <CartBadge />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-4/5 overflow-y-auto sm:max-w-xs">
              <SheetHeader>
                <SheetTitle>Maven Enterprise Ltd</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
                >
                  Home
                </Link>

                <Accordion multiple>
                  <AccordionItem value="products">
                    <AccordionTrigger className="px-3 text-sm font-medium text-foreground">
                      Products
                    </AccordionTrigger>
                    <AccordionContent className="px-3">
                      <div className="flex flex-col gap-0.5">
                        {categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/products/${category.slug}`}
                            onClick={() => setOpen(false)}
                            className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                          >
                            {category.name}
                          </Link>
                        ))}
                        <Link
                          href="/products"
                          onClick={() => setOpen(false)}
                          className="rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-accent"
                        >
                          View All Products
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="services">
                    <AccordionTrigger className="px-3 text-sm font-medium text-foreground">
                      Services
                    </AccordionTrigger>
                    <AccordionContent className="px-3">
                      <div className="flex flex-col gap-0.5">
                        {services.map((service) => (
                          <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            onClick={() => setOpen(false)}
                            className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                          >
                            {service.name}
                          </Link>
                        ))}
                        <Link
                          href="/services"
                          onClick={() => setOpen(false)}
                          className="rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-accent"
                        >
                          View All Services
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {trailingLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4">
                <Link
                  href="/quote"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({}), "w-full")}
                >
                  Request Quotation
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
