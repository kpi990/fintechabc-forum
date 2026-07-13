import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
    <nav className="border-b border-gray-800 bg-gray-950">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-gray-100">
          fintechabc
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {profile ? (
            <>
              <span className="text-gray-400">u/{profile.username}</span>
              <form action="/auth/signout" method="post">
                <button className="text-gray-400 hover:text-gray-200">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-400 hover:text-gray-200">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500"
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
