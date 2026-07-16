import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewerRole } from "@/lib/admin";
import { getOpenReportCount } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewerRole();

  if (!viewer || (!viewer.isAdmin && !viewer.isModerator)) {
    redirect("/");
  }

  const openReportCount = await getOpenReportCount();

  const tabs = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/moderation", label: "Moderation", count: openReportCount },
    ...(viewer.isAdmin ? [{ href: "/admin/users", label: "Users" }] : []),
    ...(viewer.isAdmin ? [{ href: "/admin/boards", label: "Boards" }] : []),
    { href: "/admin/audit", label: "Audit Log" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">Admin</h1>
        <p className="mt-1 text-sm text-muted">
          Signed in as {viewer.username} · {viewer.isAdmin ? "Admin" : "Moderator"}
        </p>
      </div>
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-t-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-accent"
          >
            {tab.label}
            {(tab.count ?? 0) > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-warn/20 px-1 text-[10px] font-semibold text-warn">
                {tab.count}
              </span>
            )}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
