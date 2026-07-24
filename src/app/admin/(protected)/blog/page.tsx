import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getBlogPosts } from "@/lib/data/blog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteBlogPost } from "@/app/actions/admin/blog";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default function AdminBlogPage() {
  const posts = [...getBlogPosts()].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div>
      <AdminListHeader
        title="Blog"
        description={`${posts.length} blog posts.`}
        newHref="/admin/blog/new"
        newLabel="Add Post"
      />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.slug}>
                <TableCell>
                  <div className="relative size-10 overflow-hidden rounded-md">
                    <Image src={post.coverImage.url} alt={post.coverImage.alt} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{post.title}</TableCell>
                <TableCell className="text-muted-foreground">{post.category}</TableCell>
                <TableCell>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{post.publishedAt}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/blog/${post.slug}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteBlogPost.bind(null, post.slug)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
