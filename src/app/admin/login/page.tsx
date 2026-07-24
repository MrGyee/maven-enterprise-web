import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-lg bg-primary font-heading text-lg font-semibold text-primary-foreground">
            M
          </span>
          <h1 className="mt-4 font-heading text-xl font-semibold text-foreground">
            Maven Enterprise Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your website content.</p>
        </div>
        <LoginForm next={next ?? "/admin"} />
      </div>
    </div>
  );
}
