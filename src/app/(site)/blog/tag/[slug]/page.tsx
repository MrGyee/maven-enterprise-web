import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogCategories, getBlogPostsByTagSlug, getBlogTags } from "@/lib/data/blog";
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
  const tags = await getBlogTags();
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) return {};
  return {
    title: `#${tag.name} Articles`,
    description: `Articles tagged "${tag.name}" from Maven Enterprise Ltd.`,
    alternates: { canonical: `/blog/tag/${tag.slug}` },
  };
}

export default async function BlogTagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, tags, posts] = await Promise.all([
    getBlogCategories(),
    getBlogTags(),
    getBlogPostsByTagSlug(slug),
  ]);
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) notFound();

  const sortedPosts = [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div className="pb-14">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: `#${tag.name}`, href: `/blog/tag/${tag.slug}` }]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tag"
          title={`#${tag.name}`}
          description={`${tag.count} article${tag.count === 1 ? "" : "s"} tagged "${tag.name}".`}
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
          <BlogSidebar categories={categories} tags={tags} activeTagSlug={tag.slug} />
        </div>
      </div>
    </div>
  );
}
