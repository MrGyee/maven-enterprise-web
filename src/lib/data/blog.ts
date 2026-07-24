import { blogStore } from "@/lib/store/blog.store";
import type { BlogPost } from "@/lib/data/types";

export function getBlogPosts() {
  return blogStore.getAll();
}

export function getPublishedBlogPosts() {
  return getBlogPosts().filter((p) => p.status === "published");
}

export function getBlogPostBySlug(slug: string) {
  return blogStore.getByKey(slug);
}

export function getRelatedBlogPosts(post: BlogPost) {
  return getPublishedBlogPosts()
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);
}
