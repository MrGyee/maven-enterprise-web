import type { Metadata } from "next";
import { verifySession } from "@/lib/auth/dal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await verifySession();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Signed in as {session.email}.</p>
    </div>
  );
}
