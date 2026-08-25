import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bookmark, Clock, Flame, Heart, Lightbulb, Share2, Star, ShoppingCart, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/chulha/AppShell";
import { CommentSection } from "@/components/chulha/CommentSection";
import { RecipeCard } from "@/components/chulha/RecipeCard";
import { TrendingRecipesPanel } from "@/components/chulha/Sidebars";
import { FocusMode } from "@/components/chulha/FocusMode";
import { Button } from "@/components/ui/button";
import { recipes as mockRecipes } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useGrocery } from "@/context/GroceryContext";

export const Route = createFileRoute("/recipes/$slug")({
  loader: async ({ params }) => {
    try {
      const res = await api.getRecipeBySlug(params.slug);
      if (res?.recipe) {
        let related = [];
        try {
          const relatedRes = await api.getRecipes({ cuisine: res.recipe.cuisine?.name || res.recipe.cuisineName, limit: 4 });
          if (relatedRes?.recipes) {
            related = relatedRes.recipes.filter((r) => r.id !== res.recipe.id).slice(0, 3);
          }
        } catch (e) {
          // ignore error fetching related
        }
        return { recipe: res.recipe, related };
      }
    } catch (e) {
      // Fallback below
    }
    const fallback = mockRecipes.find((r) => r.slug === params.slug);
    if (!fallback) throw notFound();
    return { recipe: fallback, related: mockRecipes.filter((r) => r.id !== fallback.id).slice(0, 3) };
  },
  notFoundComponent: RecipeNotFound,
  errorComponent: RecipeNotFound,
  component: RecipeDetail,
});

function RecipeNotFound() {
  return (
    <AppShell>
      <div className="card-soft p-10 text-center">
        <h1 className="text-2xl font-semibold">We couldn&apos;t find that recipe</h1>
        <p className="mt-2 text-muted-foreground">It may have been removed by its author.</p>
        <Button asChild className="mt-6">
          <Link to="/explore">Explore recipes</Link>
        </Button>
      </div>
    </AppShell>
  );
}

function RecipeDetail() {
  const { recipe: initialRecipe, related = [] } = Route.useLoaderData();
  const [recipe, setRecipe] = useState(initialRecipe);
  const [liked, setLiked] = useState(initialRecipe.isLiked || false);
  const [saved, setSaved] = useState(initialRecipe.isSaved || false);
  const [likesCount, setLikesCount] = useState(initialRecipe.likes || 120);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const { addIngredients } = useGrocery();

  useEffect(() => {
    setRecipe(initialRecipe);
    setLiked(initialRecipe.isLiked || false);
    setSaved(initialRecipe.isSaved || false);
    setLikesCount(initialRecipe.likes || 120);
  }, [initialRecipe]);

  const handleLike = async () => {
    try {
      const res = await api.toggleLikeRecipe(recipe.id);
      if (res?.isLiked !== undefined) {
        setLiked(res.isLiked);
        setLikesCount(res.likesCount);
      } else {
        setLiked((v) => !v);
        setLikesCount((c) => (liked ? c - 1 : c + 1));
      }
    } catch (err) {
      setLiked((v) => !v);
      setLikesCount((c) => (liked ? c - 1 : c + 1));
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.toggleSaveRecipe(recipe.id);
      if (res?.isSaved !== undefined) {
        setSaved(res.isSaved);
        toast.success(res.isSaved ? "Saved to your bookmarks" : "Removed from bookmarks");
      } else {
        setSaved((v) => !v);
        toast.success(saved ? "Removed from bookmarks" : "Saved to your bookmarks");
      }
    } catch (err) {
      setSaved((v) => !v);
      toast.success(saved ? "Removed from bookmarks" : "Saved to your bookmarks");
    }
  };

  return (
    <AppShell rightSidebar={<TrendingRecipesPanel />}>
      <article className="space-y-8">
        <img
          src={recipe.image}
          alt={recipe.title}
          width={1024}
          height={768}
          className="h-64 w-full rounded-3xl object-cover shadow-soft sm:h-96"
        />

        <header className="space-y-4">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">{recipe.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1 text-primary">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-4 fill-primary" />
              ))}
              <span className="ml-1 font-semibold text-foreground">{recipe.rating || 4.8}</span>
            </span>
            <Link
              to="/profile/$username"
              params={{ username: recipe.creator?.username || "sarahkitchen" }}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <span className="grid size-8 place-items-center rounded-full bg-secondary">
                {recipe.creator?.emoji || "👩‍🍳"}
              </span>
              By {recipe.creator?.name || "Sarah Khan"}
            </Link>
          </div>

          <ul className="flex flex-wrap gap-3 text-sm">
            <li className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              <Clock className="size-4 text-primary" /> {recipe.minutes} min
            </li>
            <li className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              <Flame className="size-4 text-primary" /> {recipe.difficulty}
            </li>
            <li className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              {recipe.flag || "🥘"} {recipe.cuisineName || recipe.cuisine}
            </li>
          </ul>

          <p className="max-w-2xl text-muted-foreground">{recipe.description}</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <section className="card-soft h-fit p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Ingredients</h2>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => addIngredients(recipe.ingredients)}
              >
                <ShoppingCart className="mr-1.5 size-3.5" /> Add to List
              </Button>
            </div>
            <ul className="space-y-3 text-sm">
              {recipe.ingredients &&
                recipe.ingredients.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Instructions</h2>
              {recipe.steps && recipe.steps.length > 0 && (
                <Button onClick={() => setIsFocusMode(true)} size="sm">
                  <Play className="mr-2 size-3.5 fill-current" /> Start Cooking
                </Button>
              )}
            </div>
            
            <ol className="space-y-4">
              {recipe.steps &&
                recipe.steps.map((step, i) => (
                  <li key={i} className="card-soft flex gap-4 p-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
            </ol>

            {recipe.tip && (
              <aside className="rounded-3xl border border-primary/30 bg-accent p-5">
                <p className="inline-flex items-center gap-2 font-semibold text-accent-foreground">
                  <Lightbulb className="size-5 text-primary" /> 💡 Beginner Tip
                </p>
                <p className="mt-2 text-sm text-accent-foreground/90">&ldquo;{recipe.tip}&rdquo;</p>
              </aside>
            )}
          </section>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-y border-border py-4">
          <Button variant={liked ? "default" : "outline"} onClick={handleLike}>
            <Heart className={cn(liked && "fill-current")} /> {likesCount} Likes
          </Button>
          <Button variant={saved ? "default" : "outline"} onClick={handleSave}>
            <Bookmark className={cn(saved && "fill-current")} /> {saved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" onClick={() => toast.success("Link copied to clipboard")}>
            <Share2 /> Share
          </Button>
        </div>

        <CommentSection recipeId={recipe.id} recipeSlug={recipe.slug} />

        <section>
          <h2 className="mb-4 text-2xl font-semibold">You might also like</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <RecipeCard key={r.id} recipe={r} compact />
            ))}
          </div>
        </section>
      </article>

      {isFocusMode && (
        <FocusMode 
          recipe={recipe} 
          onClose={() => setIsFocusMode(false)} 
        />
      )}
    </AppShell>
  );
}
