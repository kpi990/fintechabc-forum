import VoteButtons from "@/components/VoteButtons";
import Avatar from "@/components/Avatar";
import ReportButton from "@/components/ReportButton";
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
    <div className={depth > 0 ? "ml-5 border-l border-line pl-4" : "space-y-4"}>
      {children.map((comment) => (
        <div key={comment.id} className="mb-4 flex gap-3 last:mb-0">
          <VoteButtons targetType="comment" targetId={comment.id} initialScore={comment.score} />
          <div className="flex-1 rounded-xl border border-line bg-surface p-3 shadow-sm">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-muted">
              <Avatar username={comment.profiles?.username ?? "?"} />
              <span>{comment.profiles?.username ?? "[deleted]"}</span>
            </div>
            <p className="text-sm text-slate-200">
              {comment.is_removed ? (
                <em className="text-faint">[removed]</em>
              ) : (
                comment.body
              )}
            </p>
            {!comment.is_removed && (
              <div className="mt-1">
                <ReportButton targetType="comment" targetId={comment.id} />
              </div>
            )}
            <CommentThread comments={comments} parentId={comment.id} depth={depth + 1} />
          </div>
        </div>
      ))}
    </div>
  );
}
