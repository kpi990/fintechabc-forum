import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { checkBotId } from "botid/server";
import { checkLimit, getClientIp } from "@/lib/rateLimit";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const verification = await checkBotId();
    if (verification.isBot) {
      redirect("/login?error=" + encodeURIComponent("Couldn't verify your request. Please try again."));
    }
    const nextPath = String(formData.get("next") ?? "/");
    const ip = getClientIp(await headers());
    if (!checkLimit(`login:${ip}`, 10, 10 * 60 * 1000)) {
      redirect("/login?error=" + encodeURIComponent("Too many attempts. Please try again in a few minutes.") + `&next=${nextPath}`);
    }
    const supabase = await createClient();
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) redirect(`/login?error=${encodeURIComponent(error.message)}&next=${nextPath}`);
    redirect(nextPath);
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-center text-xl font-semibold tracking-tight text-slate-900">
        Log in
      </h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {error && (
          <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/10">
            {error}
          </p>
        )}
        <form action={login} className="space-y-4">
          <input type="hidden" name="next" value={next ?? "/"} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <button className="w-full rounded-lg bg-violet-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-violet-500">
            Log in
          </button>
        </form>
      </div>
      <p className="mt-4 text-center text-sm text-slate-500">
        No account?{" "}
        <Link href="/signup" className="font-medium text-violet-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
