"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Wrench,
  Briefcase,
  Quote,
  HelpCircle,
  Newspaper,
  Tag,
  Users,
  Image as ImageIcon,
  Building2,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/services", label: "Services", icon: Wrench },
      { href: "/admin/projects", label: "Projects", icon: Briefcase },
      { href: "/admin/brands", label: "Brands", icon: Tag },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
      { href: "/admin/blog", label: "Blog", icon: Newspaper },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/hero-banners", label: "Hero Banners", icon: ImageIcon },
    ],
  },
  {
    label: "Business",
    items: [
      { href: "/admin/settings/business-info", label: "Business Info", icon: Building2 },
      { href: "/admin/leads", label: "Leads", icon: Inbox },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group.label}
          </p>
          <div className="mt-1.5 flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive =
                item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
