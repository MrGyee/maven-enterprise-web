import { AdminListHeader } from "@/components/admin/admin-list-header";
import { BlogPostForm } from "@/components/admin/blog/blog-post-form";

export const dynamic = "force-dynamic";

export default function NewBlogPostPage() {
  return (
    <div>
      <AdminListHeader title="Add Blog Post" description="Write a new blog post." />
      <div className="mt-6">
        <BlogPostForm />
      </div>
    </div>
  );
}
