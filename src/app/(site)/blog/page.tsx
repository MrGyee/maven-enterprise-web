import type { Metadata } from "next";
import { getPublishedBlogPosts } from "@/lib/data/blog";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { BlogCard } from "@/components/blog/blog-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Interior Design Tips & Buying Guides Kenya",
  description:
    "Interior design tips, bathroom and kitchen inspiration, flooring guides and Kenyan home trends from Maven Enterprise Ltd.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = [...(await getPublishedBlogPosts())].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div className="pb-20">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Insights"
          title="Interior Design Tips & Buying Guides"
          description="Practical advice on interior design, bathroom and kitchen inspiration, flooring guides and the latest Kenyan home trends."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
