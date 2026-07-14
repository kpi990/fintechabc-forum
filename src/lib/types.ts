export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  karma: number;
  is_moderator: boolean;
  is_banned: boolean;
  created_at: string;
};

export type Board = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_paid: boolean;
  stripe_price_id: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  board_id: string;
  author_id: string | null;
  title: string;
  body: string | null;
  score: number;
  is_removed: boolean;
  created_at: string;
  profiles?: Pick<Profile, "username" | "avatar_url"> | null;
  boards?: Pick<Board, "name" | "slug"> | null;
  comments?: { count: number }[];
};

export type Comment = {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_id: string | null;
  body: string;
  score: number;
  is_removed: boolean;
  created_at: string;
  profiles?: Pick<Profile, "username" | "avatar_url"> | null;
};
