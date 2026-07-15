// Shared helper for gating /admin routes and server actions. Always re-checks
// the caller's role against the database (RLS also enforces this at the data
// layer, but checking here lets us return a clean redirect/error instead of
// a silent no-op update).
import { createClient } from "@/lib/supabase/server";

export type ViewerRole = {
  userId: string;
  username: string;
  isAdmin: boolean;
  isModerator: boolean;
};

export async function getViewerRole(): Promise<ViewerRole | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, is_admin, is_moderator")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    userId: user.id,
    username: profile.username,
    isAdmin: profile.is_admin,
    isModerator: profile.is_moderator,
  };
}
