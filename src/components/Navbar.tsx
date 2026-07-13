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

export default async function Navbar() {
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
    <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon size={32} />
            <div className="leading-tight">
              <div className="font-semibold tracking-tight text-slate-900">fintechabc</div>
              <div className="hidden text-[10px] uppercase tracking-wider text-slate-400 sm:block">
                Discuss · Share · Grow
              </div>
            </div>
          </Link>
          <div className="hidden items-center gap-5 text-sm text-slate-600 md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-violet-600">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {profile ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar username={profile.username} />
                <span className="hidden text-slate-600 sm:inline">{profile.username}</span>
              </div>
              <form action="/auth/signout" method="post">
                <button className="text-slate-400 transition hover:text-slate-700">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-500 transition hover:text-slate-900">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-violet-600 px-3.5 py-1.5 font-medium text-white shadow-sm transition hover:bg-violet-500"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Mobile nav row */}
      <div className="flex gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 text-sm text-slate-600 md:hidden">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap transition hover:text-violet-600">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
