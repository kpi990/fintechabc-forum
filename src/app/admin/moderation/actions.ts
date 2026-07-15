"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getViewerRole } from "@/lib/admin";
import { logAdminAction } from "@/lib/auditLog";

async function assertModerator() {
  const viewer = await getViewerRole();
  if (!viewer || (!viewer.isAdmin && !viewer.isModerator)) {
    throw new Error("Not authorized");
  }
  return viewer;
}

// Marks a report resolved without touching the underlying content
// (use when the report doesn't warrant action).
export async function dismissReport(reportId: string) {
  const viewer = await assertModerator();
  const supabase = await createClient();
  await supabase
    .from("reports")
    .update({
      resolved: true,
      resolved_by: viewer.userId,
      resolved_at: new Date().toISOString(),
      resolution: "dismissed",
    })
    .eq("id", reportId);
  await logAdminAction({
    actorId: viewer.userId,
    action: "dismiss_report",
    targetType: "report",
    targetId: reportId,
  });
  revalidatePath("/admin/moderation");
  revalidatePath("/admin");
}

// Removes the reported post or comment (soft delete via is_removed) and
// resolves the report in the same action.
export async function removeReportedContent(
  reportId: string,
  targetType: "post" | "comment",
  targetId: string
) {
  const viewer = await assertModerator();
  const supabase = await createClient();
  const table = targetType === "post" ? "posts" : "comments";
  await supabase.from(table).update({ is_removed: true }).eq("id", targetId);
  await supabase
    .from("reports")
    .update({
      resolved: true,
      resolved_by: viewer.userId,
      resolved_at: new Date().toISOString(),
      resolution: "removed",
    })
    .eq("id", reportId);
  await logAdminAction({
    actorId: viewer.userId,
    action: "remove_reported_content",
    targetType,
    targetId,
    detail: { reportId },
  });
  revalidatePath("/admin/moderation");
  revalidatePath("/admin");
  if (targetType === "post") revalidatePath(`/post/${targetId}`);
}

// Restores previously-removed content (undo).
export async function restoreContent(targetType: "post" | "comment", targetId: string) {
  const viewer = await assertModerator();
  const supabase = await createClient();
  const table = targetType === "post" ? "posts" : "comments";
  await supabase.from(table).update({ is_removed: false }).eq("id", targetId);
  await logAdminAction({
    actorId: viewer.userId,
    action: "restore_content",
    targetType,
    targetId,
  });
  revalidatePath("/admin/moderation");
}
