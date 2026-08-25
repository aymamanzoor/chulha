import { Link } from "@tanstack/react-router";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CommentSection } from "@/components/chulha/CommentSection";
import { cn } from "@/lib/utils";
import { resolveImage, defaultImages } from "@/lib/image-helper";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function PostCard({ post }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [saved, setSaved] = useState(post.isSaved || false);
  const [openComments, setOpenComments] = useState(false);

  const postImage = post.image ? resolveImage(post.image, defaultImages.pizza) : null;

  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like posts.");
      return;
    }

    try {
      const res = await api.toggleLikePost(post.id);
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

  const handleSave = async () => {
    if (!user) {
      toast.error("Please log in to save posts.");
      return;
    }

    try {
      const res = await api.toggleSavePost(post.id);
      if (res?.isSaved !== undefined) {
        setSaved(res.isSaved);
        toast.success(res.isSaved ? "Saved to your collection" : "Removed from collection");
      } else {
        setSaved((v) => !v);
        toast.success(saved ? "Removed from collection" : "Saved to your collection");
      }
    } catch (e) {
      setSaved((v) => !v);
      toast.success(saved ? "Removed from collection" : "Saved to your collection");
    }
  };

  return (
    <article className="card-soft animate-rise overflow-hidden">
      <header className="flex items-center gap-3 p-4">
        <Link
          to="/profile/$username"
          params={{ username: post.user?.username || "sarahkitchen" }}
          className="grid size-11 place-items-center rounded-full bg-secondary text-lg"
        >
          {post.user?.emoji || "👩‍🍳"}
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {post.user?.name || "Sarah Khan"}{" "}
            <Link
              to="/profile/$username"
              params={{ username: post.user?.username || "sarahkitchen" }}
              className="font-normal text-muted-foreground hover:text-primary"
            >
              @{post.user?.username || "sarahkitchen"}
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            {post.kind || "Food Post"} · {post.time || "Just now"}
          </p>
        </div>
        <button
          type="button"
          aria-label="Post options"
          className="rounded-full p-2 text-muted-foreground hover:bg-accent cursor-pointer"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </header>

      <p className="px-4 pb-3 text-[0.95rem] leading-relaxed">{post.text}</p>

      {postImage && (
        <div className="bg-muted">
          <img
            src={postImage}
            alt={post.kind || "Food post"}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImages.pizza;
            }}
            className="max-h-[28rem] w-full object-cover"
          />
        </div>
      )}

      {post.recipeSlug && (
        <div className="px-4 pt-3">
          <Link
            to="/recipes/$slug"
            params={{ slug: post.recipeSlug }}
            className="inline-flex rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/70"
          >
            View full recipe →
          </Link>
        </div>
      )}

      <div className="flex items-center gap-1 p-3">
        <button
          type="button"
          onClick={handleLike}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent cursor-pointer"
        >
          <Heart className={cn("size-[18px]", liked && "fill-primary text-primary")} />
          {likesCount} Likes
        </button>
        <button
          type="button"
          onClick={() => setOpenComments((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent cursor-pointer"
        >
          <MessageCircle className="size-[18px]" />
          {post.commentCount || 0} Comments
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="ml-auto rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent cursor-pointer"
          aria-label="Save post"
        >
          <Bookmark className={cn("size-[18px]", saved && "fill-primary text-primary")} />
        </button>
        <button
          type="button"
          onClick={() => toast.success("Link copied to clipboard")}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent cursor-pointer"
          aria-label="Share post"
        >
          <Share2 className="size-[18px]" />
        </button>
      </div>

      {openComments && (
        <div className="border-t border-border p-4">
          <CommentSection postId={post.id} />
        </div>
      )}
    </article>
  );
}
