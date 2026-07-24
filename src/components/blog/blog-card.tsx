import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/data/types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-lg hover:shadow-foreground/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={post.coverImage.url}
          alt={post.coverImage.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {post.category}
        </span>
        <h3 className="font-heading text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-auto flex items-center gap-4 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {new Date(post.publishedAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {post.readTimeMinutes} min read
          </span>
        </div>
      </div>
    </Link>
  );
}
