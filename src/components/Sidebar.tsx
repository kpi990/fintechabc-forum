import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Avatar from "@/components/Avatar";
import LogoIcon from "@/components/LogoIcon";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/markets", label: "Markets" },
  { href: "/news", label: "News" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

export default async function Sidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { username: string } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
        <LogoIcon size={34} />
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight">
            <span className="text-slate-900">fintech</span>
            <span className="text-violet-600">abc</span>
          </div>
          <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-slate-400">
            Discuss · Share · Grow
          </div>
        </div>
      </Link>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        {profile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar username={profile.username} />
              <span className="text-sm text-slate-700">{profile.username}</span>
            </div>
            <form action="/auth/signout" method="post">
              <button className="text-xs text-slate-400 transition hover:text-slate-700">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/signup"
              className="rounded-lg bg-violet-600 px-3 py-2 text-center text-sm font-medium text-white shadow-sm transition hover:bg-violet-500"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
