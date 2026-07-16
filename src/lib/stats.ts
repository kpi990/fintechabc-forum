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
    .eq("is_archived", false)
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

export type DailyCount = { date: string; count: number };

// Buckets row timestamps into calendar days (UTC) for the last `days` days,
// including days with zero activity. Fine at current scale (a handful of
// rows) - fetches raw timestamps and buckets in JS rather than a SQL
// group-by, since Supabase's JS client has no built-in date-trunc helper
// without a custom RPC. If this table grows into the thousands of rows,
// move this to a Postgres view/RPC that does the bucketing server-side.
async function getDailyCounts(
  table: "profiles" | "posts" | "comments",
  days = 30
): Promise<DailyCount[]> {
  const supabase = await createClient();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  since.setUTCHours(0, 0, 0, 0);

  const { data } = await supabase
    .from(table)
    .select("created_at")
    .gte("created_at", since.toISOString());

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  (data ?? []).forEach((row: { created_at: string }) => {
    const key = row.created_at.slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });

  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

export async function getSignupTrend(days = 30): Promise<DailyCount[]> {
  return getDailyCounts("profiles", days);
}

export async function getPostTrend(days = 30): Promise<DailyCount[]> {
  return getDailyCounts("posts", days);
}

export async function getCommentTrend(days = 30): Promise<DailyCount[]> {
  return getDailyCounts("comments", days);
}

export type TopBoard = { name: string; slug: string; postCount: number };

export async function getTopBoards(limit = 5): Promise<TopBoard[]> {
  const boards = await getBoardsWithStats();
  return [...boards]
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, limit)
    .map((b) => ({ name: b.name, slug: b.slug, postCount: b.postCount }));
}

export async function getOpenReportCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("resolved", false);
  return count ?? 0;
}
