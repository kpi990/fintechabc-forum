import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { targetType, targetId, value } = await request.json();
  if (!["post", "comment"].includes(targetType) || ![1, -1].includes(value)) {
    return NextResponse.json({ error: "Invalid vote payload" }, { status: 400 });
  }

  const column = targetType === "post" ? "post_id" : "comment_id";

  const { data: existing } = await supabase
    .from("votes")
    .select("id, value")
    .eq("user_id", user.id)
    .eq(column, targetId)
    .maybeSingle();

  if (existing && existing.value === value) {
    await supabase.from("votes").delete().eq("id", existing.id);
  } else if (existing) {
    await supabase.from("votes").update({ value }).eq("id", existing.id);
  } else {
    await supabase.from("votes").insert({ user_id: user.id, [column]: targetId, value });
  }

  const { data: votes } = await supabase.from("votes").select("value").eq(column, targetId);
  const score = (votes ?? []).reduce((sum, v) => sum + v.value, 0);

  const table = targetType === "post" ? "posts" : "comments";
  await supabase.from(table).update({ score }).eq("id", targetId);

  return NextResponse.json({ score });
}
