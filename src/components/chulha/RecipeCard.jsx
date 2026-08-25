import { Link } from "@tanstack/react-router";
import { Bookmark, Clock, Flame, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { resolveImage, defaultImages } from "@/lib/image-helper";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function RecipeCard({ recipe, compact = false }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(recipe.isLiked || false);
  const [saved, setSaved] = useState(recipe.isSaved || false);
  const [likesCount, setLikesCount] = useState(recipe.likes || 120);

  const imageSrc = resolveImage(recipe.image, defaultImages.biryani);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like recipes.");
      return;
    }

    try {
      const res = await api.toggleLikeRecipe(recipe.id);
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
      toast.error("Please log in to save recipes to your collection.");
      return;
    }

    try {
      const res = await api.toggleSaveRecipe(recipe.id);
      if (res?.isSaved !== undefined) {
        setSaved(res.isSaved);
        toast.success(res.isSaved ? "Saved to your bookmarks" : "Removed from bookmarks");
      } else {
        setSaved((v) => !v);
        toast.success(saved ? "Removed from bookmarks" : "Saved to your bookmarks");
      }
    } catch (e) {
      setSaved((v) => !v);
      toast.success(saved ? "Removed from bookmarks" : "Saved to your bookmarks");
    }
  };

  return (
    <article className="card-soft hover-lift group overflow-hidden">
      <Link
        to="/recipes/$slug"
        params={{ slug: recipe.slug }}
        className="block overflow-hidden bg-muted"
        aria-label={recipe.title}
      >
        <img
          src={imageSrc}
          alt={recipe.title}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImages.biryani;
          }}
          className={cn(
            "w-full object-cover transition-transform duration-500 group-hover:scale-105",
            compact ? "h-36" : "h-48"
          )}
        />
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
          <span className="rounded-full bg-accent px-2 py-1 font-medium text-accent-foreground flex items-center gap-1">
            <span>{recipe.flag || "🌍"}</span> <span>{recipe.cuisineName || recipe.cuisine || "Special"}</span>
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <Clock className="size-3 sm:size-3.5" /> {recipe.minutes} min
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <Flame className="size-3 sm:size-3.5" /> {recipe.difficulty}
          </span>
        </div>

        <h3 className="text-base sm:text-lg leading-snug font-semibold line-clamp-2">
          <Link to="/recipes/$slug" params={{ slug: recipe.slug }} className="hover:text-primary">
            {recipe.title}
          </Link>
        </h3>

        <div className="flex items-center justify-between min-w-0 gap-1">
          <Link
            to="/profile/$username"
            params={{ username: recipe.creator?.username || "sarahkitchen" }}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground min-w-0"
          >
            <span className="grid size-6 sm:size-7 shrink-0 place-items-center rounded-full bg-secondary text-xs sm:text-sm">
              {recipe.creator?.emoji || "👩‍🍳"}
            </span>
            <span className="truncate">{recipe.creator?.name || "Sarah Khan"}</span>
          </Link>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={handleLike}
              aria-label="Like recipe"
              className="inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent cursor-pointer"
            >
              <Heart className={cn("size-3.5 sm:size-4", liked && "fill-primary text-primary")} />
              {likesCount}
            </button>
            <button
              type="button"
              onClick={handleSave}
              aria-label="Save recipe"
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent cursor-pointer"
            >
              <Bookmark className={cn("size-3.5 sm:size-4", saved && "fill-primary text-primary")} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
