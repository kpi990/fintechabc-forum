import VoteButtons from "@/components/VoteButtons";
import type { Comment } from "@/lib/types";

type Props = {
  comments: Comment[];
  parentId: string | null;
  depth?: number;
};

export default function CommentThread({ comments, parentId, depth = 0 }: Props) {
  const children = comments.filter((c) => c.parent_id === parentId);
  if (!children.length) return null;

  return (
    <div className={depth > 0 ? "ml-6 border-l border-gray-800 pl-4" : ""}>
      {children.map((comment) => (
        <div key={comment.id} className="mb-4 flex gap-2">
          <VoteButtons targetType="comment" targetId={comment.id} initialScore={comment.score} />
          <div className="flex-1">
            <p className="text-xs text-gray-500">
              u/{comment.profiles?.username ?? "[deleted]"}
            </p>
            <p className="text-sm text-gray-200">
              {comment.is_removed ? <em className="text-gray-600">[removed]</em> : comment.body}
            </p>
            <CommentThread comments={comments} parentId={comment.id} depth={depth + 1} />
          </div>
        </div>
      ))}
    </div>
  );
}
