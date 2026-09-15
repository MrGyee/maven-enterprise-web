import { getCategories } from "@/lib/data/categories";
import { getServices } from "@/lib/data/services";
import { HeaderNav } from "@/components/layout/header-nav";

export async function Header() {
  const [categories, services] = await Promise.all([getCategories(), getServices()]);
  return <HeaderNav categories={categories} services={services} />;
}
