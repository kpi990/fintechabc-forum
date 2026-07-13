import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export type CommunityStats = {
  memberCount: number;
  postsLast7Days: number;
  totalPosts: number;
};

export async function getCommunityStats(): Promise<CommunityStats> {
  const supabase = await createClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: memberCount }, { count: postsLast7Days }, { count: totalPosts }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),
      supabase.from("posts").select("*", { count: "exact", head: true }),
    ]);

  return {
    memberCount: memberCount ?? 0,
    postsLast7Days: postsLast7Days ?? 0,
    totalPosts: totalPosts ?? 0,
  };
}

export async function getTrendingPosts(limit = 5): Promise<Post[]> {
  const supabase = await createClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url)")
    .eq("is_removed", false)
    .gte("created_at", sevenDaysAgo)
    .order("score", { ascending: false })
    .limit(limit);

  return (data as Post[] | null) ?? [];
}
