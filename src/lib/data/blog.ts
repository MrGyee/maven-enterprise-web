import { blogStore } from "@/lib/store/blog.store";
import type { BlogPost } from "@/lib/data/types";

export async function getBlogPosts() {
  return blogStore.getAll();
}

export async function getPublishedBlogPosts() {
  return (await getBlogPosts()).filter((p) => p.status === "published");
}

export async function getBlogPostBySlug(slug: string) {
  return blogStore.getByKey(slug);
}

export async function getRelatedBlogPosts(post: BlogPost) {
  return (await getPublishedBlogPosts())
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);
}
