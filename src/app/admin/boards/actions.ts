"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewerRole } from "@/lib/admin";
import { logAdminAction } from "@/lib/auditLog";

async function assertAdmin() {
  const viewer = await getViewerRole();
  if (!viewer || !viewer.isAdmin) {
    throw new Error("Not authorized");
  }
  return viewer;
}

const SLUG_PATTERN = /^[a-z0-9-]{2,40}$/;

export async function createBoard(formData: FormData) {
  const viewer = await assertAdmin();

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isPaid = formData.get("is_paid") === "on";

  if (!SLUG_PATTERN.test(slug) || !name) {
    redirect(
      "/admin/boards?error=" +
        encodeURIComponent(
          "Slug must be 2-40 characters (lowercase letters, numbers, hyphens) and name is required."
        )
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("boards").insert({
    slug,
    name,
    description: description || null,
    is_paid: isPaid,
  });

  if (error) {
    const message =
      error.code === "23505" ? `Board slug "${slug}" already exists.` : "Couldn't create board.";
    redirect("/admin/boards?error=" + encodeURIComponent(message));
  }

  await logAdminAction({
    actorId: viewer.userId,
    action: "create_board",
    targetType: "board",
    targetId: slug,
    detail: { name, isPaid },
  });

  revalidatePath("/admin/boards");
  revalidatePath("/community");
  redirect("/admin/boards");
}

export async function updateBoard(boardId: string, formData: FormData) {
  const viewer = await assertAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isPaid = formData.get("is_paid") === "on";

  if (!name) {
    redirect("/admin/boards?error=" + encodeURIComponent("Board name is required."));
  }

  const supabase = await createClient();
  await supabase
    .from("boards")
    .update({ name, description: description || null, is_paid: isPaid })
    .eq("id", boardId);

  await logAdminAction({
    actorId: viewer.userId,
    action: "update_board",
    targetType: "board",
    targetId: boardId,
    detail: { name, isPaid },
  });

  revalidatePath("/admin/boards");
  revalidatePath("/community");
  redirect("/admin/boards");
}

export async function setBoardArchived(boardId: string, archived: boolean) {
  const viewer = await assertAdmin();
  const supabase = await createClient();
  await supabase.from("boards").update({ is_archived: archived }).eq("id", boardId);

  await logAdminAction({
    actorId: viewer.userId,
    action: archived ? "archive_board" : "unarchive_board",
    targetType: "board",
    targetId: boardId,
  });

  revalidatePath("/admin/boards");
  revalidatePath("/community");
}
