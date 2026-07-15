import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { checkBotId } from "botid/server";
import { checkLimit, getClientIp } from "@/lib/rateLimit";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function signup(formData: FormData) {
    "use server";
    const verification = await checkBotId();
    if (verification.isBot) {
      redirect("/signup?error=" + encodeURIComponent("Couldn't verify your request. Please try again."));
    }
    const ip = getClientIp(await headers());
    if (!checkLimit(`signup:${ip}`, 5, 15 * 60 * 1000)) {
      redirect("/signup?error=" + encodeURIComponent("Too many signup attempts. Please try again in a few minutes."));
    }
    const supabase = await createClient();
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const username = String(formData.get("username"));

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
    redirect("/login?next=/");
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-center text-xl font-semibold tracking-tight text-slate-50">
        Sign up
      </h1>
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm">
        {error && (
          <p className="mb-4 rounded-lg bg-down/10 p-3 text-sm text-down ring-1 ring-inset ring-down/20">
            {error}
          </p>
        )}
        <form action={signup} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">Username</label>
            <input
              name="username"
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              className="w-full rounded-lg border border-line-strong px-3 py-2 text-slate-50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border border-line-strong px-3 py-2 text-slate-50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-line-strong px-3 py-2 text-slate-50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <button className="w-full rounded-lg bg-accent px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-violet-400">
            Sign up
          </button>
        </form>
      </div>
      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
