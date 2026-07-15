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

  let profile: { username: string; is_moderator: boolean; is_admin: boolean } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, is_moderator, is_admin")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface md:flex">
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
        <LogoIcon size={34} />
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight">
            <span className="text-slate-50">fintech</span>
            <span className="text-accent">abc</span>
          </div>
          <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-faint">
            Ask Better. Build Better. Compound Better.
          </div>
        </div>
      </Link>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-accent/10 hover:text-accent"
          >
            {link.label}
          </Link>
        ))}
        {profile && (profile.is_moderator || profile.is_admin) && (
          <Link
            href="/admin"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-accent transition hover:bg-accent/10"
          >
            Admin
          </Link>
        )}
      </nav>

      <div className="border-t border-line p-4">
        {profile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar username={profile.username} />
              <span className="text-sm text-slate-200">{profile.username}</span>
            </div>
            <form action="/auth/signout" method="post">
              <button className="text-xs text-faint transition hover:text-slate-200">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/signup"
              className="rounded-lg bg-accent px-3 py-2 text-center text-sm font-medium text-white shadow-sm transition hover:bg-violet-400"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-line px-3 py-2 text-center text-sm font-medium text-muted transition hover:bg-white/5"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
