import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bookmark, Grid3x3, NotebookPen, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/chulha/AppShell";
import { RecipeCard } from "@/components/chulha/RecipeCard";
import { SuggestedUsersPanel } from "@/components/chulha/Sidebars";
import { Button } from "@/components/ui/button";
import { posts as mockPosts, recipes as mockRecipes, users as mockUsers } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile/$username")({
  loader: async ({ params }) => {
    try {
      const res = await api.getProfile(params.username);
      if (res?.user) {
        return {
          user: res.user,
          recipes: res.recipes || [],
          posts: res.posts || [],
          savedRecipes: res.savedRecipes || [],
        };
      }
    } catch (e) {
      // Fallback
    }

    const fallbackUser = mockUsers.find((u) => u.username === params.username);
    if (!fallbackUser) throw notFound();
    return {
      user: fallbackUser,
      recipes: mockRecipes.filter((r) => r.creator.username === fallbackUser.username),
      posts: mockPosts.filter((p) => p.user.username === fallbackUser.username),
      savedRecipes: mockRecipes.slice(2, 5),
    };
  },
  notFoundComponent: ProfileNotFound,
  errorComponent: ProfileNotFound,
  component: ProfilePage,
});

function ProfileNotFound() {
  return (
    <AppShell>
      <div className="card-soft p-10 text-center">
        <h1 className="text-2xl font-semibold">No cook by that name</h1>
        <Button asChild className="mt-6">
          <Link to="/feed">Back to the feed</Link>
        </Button>
      </div>
    </AppShell>
  );
}

const tabs = [
  { id: "posts", label: "Posts", icon: Grid3x3 },
  { id: "recipes", label: "Recipes", icon: NotebookPen },
  { id: "saved", label: "Saved", icon: Bookmark },
];

function ProfilePage() {
  const data = Route.useLoaderData();
  const [user, setUser] = useState(data.user);
  const [tab, setTab] = useState("posts");
  const [following, setFollowing] = useState(data.user.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(data.user.followers || 0);

  useEffect(() => {
    setUser(data.user);
    setFollowing(data.user.isFollowing || false);
    setFollowersCount(data.user.followers || 0);
  }, [data.user]);

  const gallery = (data.posts && data.posts.length > 0 ? data.posts : mockPosts).filter((p) => p.image);
  const userRecipes = data.recipes && data.recipes.length > 0 ? data.recipes : mockRecipes.slice(0, 3);
  const saved = data.savedRecipes && data.savedRecipes.length > 0 ? data.savedRecipes : mockRecipes.slice(2, 5);

  const handleToggleFollow = async () => {
    try {
      const res = await api.toggleFollow(user.id);
      if (res?.isFollowing !== undefined) {
        setFollowing(res.isFollowing);
        setFollowersCount(res.followersCount);
        toast.success(res.message);
      } else {
        setFollowing((v) => !v);
        setFollowersCount((c) => (following ? c - 1 : c + 1));
      }
    } catch (e) {
      setFollowing((v) => !v);
      setFollowersCount((c) => (following ? c - 1 : c + 1));
    }
  };

  const stats = [
    { label: "Posts", value: user.postsCount || user.posts || gallery.length },
    { label: "Recipes", value: user.recipesCount || user.recipes || userRecipes.length },
    { label: "Followers", value: followersCount.toLocaleString() },
    { label: "Following", value: user.following || 120 },
  ];

  return (
    <AppShell rightSidebar={<SuggestedUsersPanel />}>
      <div className="space-y-8">
        <header className="card-soft bg-warm-glow p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="grid size-24 shrink-0 place-items-center rounded-full bg-card text-4xl shadow-soft">
              {user.emoji || "👩‍🍳"}
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              <h1 className="font-display text-3xl font-semibold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <p className="max-w-md text-sm">{user.bio}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={following ? "soft" : "hero"}
                onClick={handleToggleFollow}
              >
                {following ? "Unfollow" : "Follow"}
              </Button>
              <Button variant="outline" onClick={() => toast("Profile editing available in settings")}>
                <Settings /> Edit Profile
              </Button>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-card p-4 text-center shadow-soft">
                <dd className="font-display text-2xl font-semibold">{stat.value}</dd>
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </header>

        <div className="flex gap-2 rounded-full bg-muted p-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors cursor-pointer",
                tab === t.id
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "posts" && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {gallery.map((post) => (
              <div key={post.id} className="group relative overflow-hidden rounded-2xl">
                <img
                  src={post.image}
                  alt={`Dish photo by ${user.name}`}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <p className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-foreground/80 to-transparent p-3 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
                  ❤️ {post.likes || 12} · 💬 {post.commentCount || 2}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === "recipes" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {userRecipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} compact />
            ))}
          </div>
        )}

        {tab === "saved" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((r) => (
              <RecipeCard key={r.id} recipe={r} compact />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
