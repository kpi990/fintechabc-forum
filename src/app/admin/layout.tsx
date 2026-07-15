import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewerRole } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewerRole();

  if (!viewer || (!viewer.isAdmin && !viewer.isModerator)) {
    redirect("/");
  }

  const tabs = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/moderation", label: "Moderation" },
    ...(viewer.isAdmin ? [{ href: "/admin/users", label: "Users" }] : []),
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Admin</h1>
        <p className="mt-1 text-sm text-slate-500">
          Signed in as {viewer.username} · {viewer.isAdmin ? "Admin" : "Moderator"}
        </p>
      </div>
      <div className="mb-6 flex gap-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="rounded-t-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-violet-700"
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
