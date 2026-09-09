import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedBlogPosts } from "@/lib/data/blog";
import { SectionHeading } from "@/components/shared/section-heading";
import { BlogCard } from "@/components/blog/blog-card";

export async function LatestBlogPosts() {
  const posts = [...(await getPublishedBlogPosts())]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="From the Blog"
          title="Latest Articles & Guides"
          description="Interior design tips, buying guides and trends for the Kenyan market."
        />
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          Visit the blog <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
