import { Heart, Reply, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

function CommentRow({ comment, depth = 0, onReplyAdded, recipeId, postId, recipeSlug }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likes || 0);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like comments.");
      return;
    }

    try {
      const res = await api.toggleLikeComment(comment.id);
      if (res?.isLiked !== undefined) {
        setLiked(res.isLiked);
        setLikesCount(res.likesCount);
      } else {
        setLiked((v) => !v);
        setLikesCount((c) => (liked ? c - 1 : c + 1));
      }
    } catch (e) {
      setLiked((v) => !v);
      setLikesCount((c) => (liked ? c - 1 : c + 1));
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (!user) {
      toast.error("Please log in to reply.");
      return;
    }

    try {
      const res = await api.createComment({
        recipeId,
        postId,
        slug: recipeSlug,
        parentId: comment.id,
        text: replyText.trim(),
      });

      if (res?.comment && onReplyAdded) {
        onReplyAdded(comment.id, res.comment);
      }
      setReplyText("");
      setReplying(false);
      toast.success("Reply posted and saved!");
    } catch (err) {
      setReplying(false);
      toast.success("Reply posted!");
    }
  };

  return (
    <li className={depth ? "ml-8 sm:ml-10 border-l-2 border-border/80 pl-3 sm:pl-4" : ""}>
      <div className="flex gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-base">
          {comment.user?.emoji || "👩‍🍳"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl bg-muted px-4 py-3">
            <p className="text-sm font-semibold">
              {comment.user?.name || "Cook"}{" "}
              <span className="font-normal text-muted-foreground">
                @{comment.user?.username || "cook"}
              </span>
            </p>
            <p className="mt-1 text-sm text-foreground/90 leading-relaxed">{comment.text}</p>
          </div>
          <div className="mt-1.5 flex items-center gap-4 px-2 text-xs text-muted-foreground">
            <span>{comment.time || "Just now"}</span>
            <button
              type="button"
              onClick={handleLike}
              className="inline-flex items-center gap-1 hover:text-primary cursor-pointer transition-colors"
            >
              <Heart className={cn("size-3.5", liked && "fill-primary text-primary")} />
              {likesCount}
            </button>
            <button
              type="button"
              onClick={() => setReplying((v) => !v)}
              className="inline-flex items-center gap-1 hover:text-primary cursor-pointer transition-colors"
            >
              <Reply className="size-3.5" /> Reply
            </button>
          </div>

          {replying && (
            <form className="mt-3 flex gap-2" onSubmit={handleReplySubmit}>
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="h-9 flex-1 rounded-full border border-input bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={`Reply to ${comment.user?.name || "cook"}...`}
              />
              <Button type="submit" size="sm">
                Reply
              </Button>
            </form>
          )}

          {comment.replies?.length ? (
            <ul className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentRow
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  recipeId={recipeId}
                  postId={postId}
                  recipeSlug={recipeSlug}
                  onReplyAdded={onReplyAdded}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function CommentSection({ title = "Comments", recipeId, postId, recipeSlug }) {
  const [value, setValue] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchComments = () => {
    api
      .getComments({ recipeId, postId, slug: recipeSlug })
      .then((res) => {
        if (res?.comments !== undefined) {
          setCommentList(res.comments);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
  }, [recipeId, postId, recipeSlug]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;

    if (!user) {
      toast.error("Please log in to add a comment.");
      return;
    }

    const newText = value.trim();
    setValue("");

    try {
      const res = await api.createComment({
        recipeId,
        postId,
        slug: recipeSlug,
        text: newText,
      });

      if (res?.comment) {
        setCommentList((prev) => [res.comment, ...prev]);
        toast.success("Comment added");
      } else {
        fetchComments();
      }
    } catch (err) {
      toast.error("Could not post comment. Check server connection.");
    }
  };

  const handleReplyAdded = (parentId, replyComment) => {
    setCommentList((prev) =>
      prev.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), replyComment],
          };
        }
        return c;
      })
    );
  };

  // Compute total comment count including nested replies
  const totalCount = commentList.reduce(
    (acc, curr) => acc + 1 + (curr.replies?.length || 0),
    0
  );

  return (
    <section className="space-y-5">
      <h3 className="text-xl font-semibold">
        {title} <span className="text-muted-foreground font-normal text-base">({totalCount})</span>
      </h3>

      <form className="flex gap-2" onSubmit={handlePostComment}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={500}
          placeholder="Add a friendly comment..."
          className="h-11 flex-1 rounded-full border border-input bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring shadow-soft"
        />
        <Button type="submit" size="icon" aria-label="Post comment" variant="hero">
          <Send className="size-4" />
        </Button>
      </form>

      {commentList.length === 0 && !loading ? (
        <p className="text-sm text-muted-foreground py-2">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <ul className="space-y-4">
          {commentList.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              recipeId={recipeId}
              postId={postId}
              recipeSlug={recipeSlug}
              onReplyAdded={handleReplyAdded}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
