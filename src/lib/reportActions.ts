"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitReport(
  targetType: "post" | "comment",
  targetId: string,
  reason: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in to report content." };
  }
  if (!reason.trim()) {
    return { error: "Please add a short reason." };
  }

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    post_id: targetType === "post" ? targetId : null,
    comment_id: targetType === "comment" ? targetId : null,
    reason: reason.trim().slice(0, 500),
  });

  if (error) {
    // RLS blocks this for banned users — surface a clean message either way.
    return { error: "Couldn't submit the report. It may already have been reported." };
  }

  revalidatePath("/admin/moderation");
  return { success: true };
}
