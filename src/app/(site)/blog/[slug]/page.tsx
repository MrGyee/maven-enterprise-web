import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/data/blog";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { JsonLd } from "@/components/shared/json-ld";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.seoDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { images: [{ url: post.coverImage.url }] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  const related = await getRelatedBlogPosts(post);
  const paragraphs = post.content.split("\n\n");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    image: post.coverImage.url,
    author: { "@type": "Person", name: post.author },
    datePublished: post.publishedAt,
    publisher: { "@type": "Organization", name: "Maven Enterprise Ltd" },
  };

  return (
    <article className="pb-20">
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title, href: `/blog/${post.slug}` }]} />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{post.category}</span>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">{post.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="size-4" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            {new Date(post.publishedAt).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {post.readTimeMinutes} min read
          </span>
        </div>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={post.coverImage.url} alt={post.coverImage.alt} fill sizes="800px" priority className="object-cover" />
        </div>

        <div className="mt-8">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mt-4 text-base leading-relaxed text-foreground first:mt-0">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Related Articles</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
