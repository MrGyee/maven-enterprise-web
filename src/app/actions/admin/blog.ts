"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { blogPostAdminSchema, type BlogPostAdminValues } from "@/lib/validation/admin";
import { blogStore } from "@/lib/store/blog.store";
import type { BlogPost } from "@/lib/data/types";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateBlogPaths(post: BlogPost) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/blog");
}

export async function createBlogPost(values: BlogPostAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = blogPostAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (await blogStore.getByKey(parsed.data.slug)) {
    return { success: false, error: "A blog post with this slug already exists." };
  }
  await blogStore.create(parsed.data);
  revalidateBlogPaths(parsed.data);
  return { success: true };
}

export async function updateBlogPost(
  originalSlug: string,
  values: BlogPostAdminValues
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = blogPostAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const existing = await blogStore.getByKey(originalSlug);
  if (!existing) {
    return { success: false, error: "Blog post not found." };
  }
  if (parsed.data.slug !== originalSlug && (await blogStore.getByKey(parsed.data.slug))) {
    return { success: false, error: "A blog post with this slug already exists." };
  }
  await blogStore.remove(originalSlug);
  await blogStore.create(parsed.data);
  revalidateBlogPaths(existing);
  revalidateBlogPaths(parsed.data);
  return { success: true };
}

export async function deleteBlogPost(slug: string): Promise<ActionResult> {
  await requireAdmin();
  const existing = await blogStore.getByKey(slug);
  if (!existing) {
    return { success: false, error: "Blog post not found." };
  }
  await blogStore.remove(slug);
  revalidateBlogPaths(existing);
  return { success: true };
}
