import type { Metadata } from "next";
import { getPublishedBlogPosts, getBlogCategories, getBlogTags } from "@/lib/data/blog";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Interior Design Tips & Buying Guides Kenya",
  description:
    "Interior design tips, bathroom and kitchen inspiration, flooring guides and Kenyan home trends from Maven Enterprise Ltd.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const [postsRaw, categories, tags] = await Promise.all([
    getPublishedBlogPosts(),
    getBlogCategories(),
    getBlogTags(),
  ]);
  const posts = [...postsRaw].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div className="pb-14">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Insights"
          title="Interior Design Tips & Buying Guides"
          description="Practical advice on interior design, bathroom and kitchen inspiration, flooring guides and the latest Kenyan home trends."
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No articles published yet — check back soon.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
          <BlogSidebar categories={categories} tags={tags} />
        </div>
      </div>
    </div>
  );
}
