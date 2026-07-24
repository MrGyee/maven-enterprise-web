import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/data/blog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { BlogPostForm } from "@/components/admin/blog/blog-post-form";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div>
      <AdminListHeader title={`Edit ${post.title}`} description="Update this blog post." />
      <div className="mt-6">
        <BlogPostForm post={post} />
      </div>
    </div>
  );
}
