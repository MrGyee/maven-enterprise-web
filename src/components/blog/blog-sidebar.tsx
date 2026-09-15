import Link from "next/link";
import { cn } from "@/lib/utils";

interface BlogTerm {
  name: string;
  slug: string;
  count: number;
}

export function BlogSidebar({
  categories,
  tags,
  activeCategorySlug,
  activeTagSlug,
}: {
  categories: BlogTerm[];
  tags: BlogTerm[];
  activeCategorySlug?: string;
  activeTagSlug?: string;
}) {
  return (
    <aside className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">Categories</h2>
        <ul className="mt-3 flex flex-col gap-1">
          <li>
            <Link
              href="/blog"
              className={cn(
                "flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
                !activeCategorySlug && "bg-accent font-medium text-foreground"
              )}
            >
              All Articles
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/blog/category/${category.slug}`}
                className={cn(
                  "flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
                  activeCategorySlug === category.slug && "bg-accent font-medium text-foreground"
                )}
              >
                {category.name}
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {tags.length > 0 && (
        <div>
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">Popular Tags</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/blog/tag/${tag.slug}`}
                className={cn(
                  "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary",
                  activeTagSlug === tag.slug && "border-primary bg-primary/10 text-primary"
                )}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
