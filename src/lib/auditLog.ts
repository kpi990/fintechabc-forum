import { createClient } from "@/lib/supabase/server";

// Append-only audit trail for admin/moderator actions. Every mutating admin
// action (ban, promote, rename, board create/edit/archive, report
// resolution) should call this. Best-effort: a logging failure never blocks
// the underlying action - losing an audit entry is bad, but blocking a ban
// or a moderation action because logging hiccuped would be worse.
export async function logAdminAction(params: {
  actorId: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  detail?: Record<string, unknown>;
}) {
  try {
    const supabase = await createClient();
    await supabase.from("admin_actions").insert({
      actor_id: params.actorId,
      action: params.action,
      target_type: params.targetType,
      target_id: params.targetId ?? null,
      detail: params.detail ?? null,
    });
  } catch {
    // Swallow - see comment above.
  }
}
