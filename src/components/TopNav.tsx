import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Avatar from "@/components/Avatar";
import LogoIcon from "@/components/LogoIcon";
import NavLinks from "@/components/NavLinks";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/markets", label: "Markets" },
  { href: "/credit-cards", label: "Credit Cards" },
  { href: "/news", label: "News" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

export default async function TopNav() {
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

  const links = [
    ...NAV_LINKS,
    ...(profile && (profile.is_moderator || profile.is_admin)
      ? [{ href: "/admin", label: "Admin" }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6 sm:gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <LogoIcon size={30} />
          <div className="leading-tight">
            <div className="text-[16px] font-semibold tracking-tight">
              <span className="text-slate-50">fintech</span>
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                abc
              </span>
            </div>
            <div className="hidden text-[8px] font-medium uppercase tracking-[0.1em] text-faint sm:block">
              Ask Better · Build Better · Compound Better
            </div>
          </div>
        </Link>

        <NavLinks links={links} />

        <div className="flex shrink-0 items-center gap-3">
          {profile ? (
            <>
              <div className="hidden items-center gap-2 sm:flex">
                <Avatar username={profile.username} />
                <span className="text-sm text-slate-200">{profile.username}</span>
              </div>
              <form action="/auth/signout" method="post">
                <button className="text-xs text-faint transition hover:text-slate-200">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-muted transition hover:text-slate-50">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
