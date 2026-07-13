import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const nextPath = String(formData.get("next") ?? "/");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) redirect(`/login?error=${encodeURIComponent(error.message)}&next=${nextPath}`);
    redirect(nextPath);
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-xl font-semibold">Log in</h1>
      {error && <p className="mb-4 rounded bg-red-950 p-2 text-sm text-red-400">{error}</p>}
      <form action={login} className="space-y-4">
        <input type="hidden" name="next" value={next ?? "/"} />
        <div>
          <label className="mb-1 block text-sm text-gray-400">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-400">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2"
          />
        </div>
        <button className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500">
          Log in
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-400">
        No account?{" "}
        <Link href="/signup" className="text-blue-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
