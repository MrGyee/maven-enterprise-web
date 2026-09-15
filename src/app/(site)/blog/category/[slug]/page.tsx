import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getBlogCategories,
  getBlogPostsByCategorySlug,
  getBlogTags,
} from "@/lib/data/blog";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getBlogCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.name} Articles`,
    description: `Articles about ${category.name.toLowerCase()} from Maven Enterprise Ltd.`,
    alternates: { canonical: `/blog/category/${category.slug}` },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, tags, posts] = await Promise.all([
    getBlogCategories(),
    getBlogTags(),
    getBlogPostsByCategorySlug(slug),
  ]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const sortedPosts = [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div className="pb-14">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: category.name, href: `/blog/category/${category.slug}` }]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Category"
          title={category.name}
          description={`${category.count} article${category.count === 1 ? "" : "s"} in this category.`}
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
          <BlogSidebar categories={categories} tags={tags} activeCategorySlug={category.slug} />
        </div>
      </div>
    </div>
  );
}
