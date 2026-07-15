"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export async function setUsername(targetUserId: string, formData: FormData) {
  await assertAdmin();

  const raw = String(formData.get("username") ?? "").trim();

  if (!USERNAME_PATTERN.test(raw)) {
    redirect(
      "/admin/users?error=" +
        encodeURIComponent("Username must be 3-20 characters: letters, numbers, underscores only.")
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ username: raw })
    .eq("id", targetUserId);

  if (error) {
    // 23505 = unique_violation (username is a `unique not null` column)
    const message =
      error.code === "23505"
        ? `Username "${raw}" is already taken.`
        : "Couldn't update username. Please try again.";
    redirect("/admin/users?error=" + encodeURIComponent(message));
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirect("/admin/users");
}
