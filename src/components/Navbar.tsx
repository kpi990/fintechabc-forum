import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Avatar from "@/components/Avatar";

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
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 text-sm font-bold text-white">
            f
          </span>
          <span className="font-semibold tracking-tight text-slate-900">fintechabc</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {profile ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar username={profile.username} />
                <span className="text-slate-600">{profile.username}</span>
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
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 font-medium text-white shadow-sm transition hover:bg-indigo-500"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
