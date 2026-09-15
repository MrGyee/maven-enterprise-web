import { cache } from "react";
import { blogStore } from "@/lib/store/blog.store";
import type { BlogPost } from "@/lib/data/types";

export const getBlogPosts = cache(async () => {
  return blogStore.getAll();
});

export async function getPublishedBlogPosts() {
  return (await getBlogPosts()).filter((p) => p.status === "published");
}

export const getBlogPostBySlug = cache(async (slug: string) => {
  return blogStore.getByKey(slug);
});

// Matches the slugify() duplicated across admin/*-form.tsx components, kept
// separate here since those generate slugs for admin-entered *fields* while
// this derives URL slugs from free-text category/tag values on the fly.
export function slugifyBlogTerm(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getBlogCategories() {
  const posts = await getPublishedBlogPosts();
  const counts = new Map<string, number>();
  for (const post of posts) counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slugifyBlogTerm(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getBlogTags() {
  const posts = await getPublishedBlogPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slugifyBlogTerm(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function getBlogPostsByCategorySlug(categorySlug: string) {
  const posts = await getPublishedBlogPosts();
  return posts.filter((p) => slugifyBlogTerm(p.category) === categorySlug);
}

export async function getBlogPostsByTagSlug(tagSlug: string) {
  const posts = await getPublishedBlogPosts();
  return posts.filter((p) => p.tags.some((t) => slugifyBlogTerm(t) === tagSlug));
}

// Same category first; if that alone can't fill 3, top up with posts sharing
// at least one tag, then with the most recent remaining posts — so this
// never comes up empty just because a category currently has only one post.
export async function getRelatedBlogPosts(post: BlogPost) {
  const others = (await getPublishedBlogPosts()).filter((p) => p.slug !== post.slug);

  const sameCategory = others.filter((p) => p.category === post.category);
  const byTag = others.filter(
    (p) => !sameCategory.includes(p) && p.tags.some((t) => post.tags.includes(t))
  );
  const combined = [...sameCategory, ...byTag];

  if (combined.length >= 3) return combined.slice(0, 3);

  const recent = others
    .filter((p) => !combined.includes(p))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return [...combined, ...recent].slice(0, 3);
}
