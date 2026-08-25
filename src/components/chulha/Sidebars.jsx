import { Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { useState, useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import { UserCard } from "@/components/chulha/UserCard";
import { recipes as mockRecipes, users as mockUsers } from "@/lib/mock-data";
import { resolveImage, defaultImages } from "@/lib/image-helper";
import { api } from "@/lib/api";

export function TrendingRecipesPanel() {
  const [trending, setTrending] = useState(mockRecipes.slice(0, 4));

  useEffect(() => {
    api
      .getRecipes({ limit: 4 })
      .then((res) => {
        if (res?.recipes && res.recipes.length > 0) {
          setTrending(res.recipes.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="card-soft p-4">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <Flame className="size-4 text-primary" /> Trending Recipes
      </h2>
      <ul className="mt-3 space-y-2">
        {trending.map((recipe) => {
          const imgSrc = resolveImage(recipe.image, defaultImages.biryani);
          return (
            <li key={recipe.id}>
              <Link
                to="/recipes/$slug"
                params={{ slug: recipe.slug }}
                className="flex items-center gap-3 rounded-2xl p-1.5 transition-colors hover:bg-accent"
              >
                <img
                  src={imgSrc}
                  alt={recipe.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImages.biryani;
                  }}
                  className="size-12 rounded-xl object-cover bg-muted"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{recipe.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {recipe.flag || "🥘"} {recipe.cuisineName || recipe.cuisine} · {recipe.minutes} min
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}



export function SuggestedUsersPanel() {
  const { user: currentUser } = useAuth();
  const [suggested, setSuggested] = useState(mockUsers.slice(0, 4));

  useEffect(() => {
    api
      .getSuggestedUsers()
      .then((res) => {
        if (res?.users && res.users.length > 0) {
          const filtered = res.users.filter(u => u.username !== currentUser?.username);
          setSuggested(filtered.slice(0, 4));
        }
      })
      .catch(() => {});
  }, [currentUser]);

  return (
    <section className="card-soft p-4">
      <h2 className="text-base font-semibold">Suggested Users</h2>
      <ul className="mt-3 space-y-3">
        {suggested.map((user) => (
          <li key={user.id}>
            <UserCard user={user} subtitle={`${user.followers || 120} followers`} />
          </li>
        ))}
      </ul>
    </section>
  );
}
