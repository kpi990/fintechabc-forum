"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getViewerRole } from "@/lib/admin";

async function assertAdmin() {
  const viewer = await getViewerRole();
  if (!viewer || !viewer.isAdmin) {
    throw new Error("Not authorized");
  }
  return viewer;
}

export async function setBanned(targetUserId: string, banned: boolean) {
  const viewer = await assertAdmin();
  if (targetUserId === viewer.userId) throw new Error("Cannot ban your own account");
  const supabase = await createClient();
  await supabase.from("profiles").update({ is_banned: banned }).eq("id", targetUserId);
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function setModerator(targetUserId: string, isModerator: boolean) {
  const viewer = await assertAdmin();
  if (targetUserId === viewer.userId) throw new Error("Cannot change your own role");
  const supabase = await createClient();
  await supabase.from("profiles").update({ is_moderator: isModerator }).eq("id", targetUserId);
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}
