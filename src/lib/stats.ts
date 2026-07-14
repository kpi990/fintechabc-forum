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

// Trending = highest score among posts from the last 7 days. Falls back to
// most recent posts overall if nothing in the last 7 days has any score yet
// (realistic for a brand-new community with little activity).
export async function getTrendingPosts(limit = 5): Promise<Post[]> {
  const supabase = await createClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), boards(name, slug), comments(count)")
    .eq("is_removed", false)
    .gte("created_at", sevenDaysAgo)
    .order("score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (data && data.length) return data as unknown as Post[];

  // No posts in the last 7 days yet — show the most recent posts instead of
  // an empty dashboard, since this is genuinely how a new community looks.
  const { data: recent } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), boards(name, slug), comments(count)")
    .eq("is_removed", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (recent as unknown as Post[]) ?? [];
}

export type BoardWithStats = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_paid: boolean;
  postCount: number;
};

export async function getBoardsWithStats(): Promise<BoardWithStats[]> {
  const supabase = await createClient();
  const { data: boards } = await supabase
    .from("boards")
    .select("*")
    .order("created_at", { ascending: true });

  if (!boards?.length) return [];

  const withCounts = await Promise.all(
    boards.map(async (board) => {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("board_id", board.id)
        .eq("is_removed", false);
      return {
        id: board.id,
        slug: board.slug,
        name: board.name,
        description: board.description,
        is_paid: board.is_paid,
        postCount: count ?? 0,
      };
    })
  );

  return withCounts;
}
