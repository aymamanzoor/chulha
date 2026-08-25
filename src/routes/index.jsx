import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChefHat, Clock, Heart, Sparkles, Users } from "lucide-react";

import { Brand } from "@/components/chulha/AppShell";
import { CuisineCard } from "@/components/chulha/CuisineCard";
import { RecipeCard } from "@/components/chulha/RecipeCard";
import { Button } from "@/components/ui/button";
import { beginnerRecipes, cuisines, images, recipes, users } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/explore" className="hover:text-foreground">Explore</Link>
          <Link to="/cuisines" className="hover:text-foreground">Cuisines</Link>
          <Link to="/beginner" className="hover:text-foreground">Beginner</Link>
          <Link to="/feed" className="hover:text-foreground">Community</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild size="sm" variant="hero">
            <Link to="/register">Join free</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-warm-glow relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="animate-rise space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-medium shadow-soft">
              <Sparkles className="size-3.5 text-primary" /> Instagram for cooking, made for beginners
            </span>
            <h1 className="font-display text-5xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
              Cook. <span className="text-gradient-warm">Share.</span> Discover.
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              A friendly cooking community for beginners and food lovers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="hero">
                <Link to="/explore">Explore Recipes <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/register">Join Community</Link>
              </Button>
            </div>
            <dl className="flex gap-8 pt-4">
              {[
                { label: "Home cooks", value: "12k+" },
                { label: "Recipes", value: "3.9k" },
                { label: "Cuisines", value: "10" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  <dd className="font-display text-2xl font-semibold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <img
              src={images.heroTable}
              alt="A warm table full of home-cooked dishes"
              width={1408}
              height={1104}
              className="w-full rounded-[2rem] object-cover shadow-lift"
            />

            <div className="animate-float card-soft absolute -left-2 top-8 flex items-center gap-3 p-3 sm:-left-8">
              <span className="grid size-9 place-items-center rounded-full bg-secondary">
                {users[0].emoji}
              </span>
              <div className="text-xs">
                <p className="font-semibold">{users[0].name}</p>
                <p className="text-muted-foreground">Made my first pizza 🍕</p>
              </div>
            </div>

            <div
              className="animate-float card-soft absolute -right-2 bottom-10 flex items-center gap-2 p-3 text-xs sm:-right-6"
              style={{ animationDelay: "1.5s" }}
            >
              <Heart className="size-4 fill-primary text-primary" />
              <span className="font-semibold">245 likes</span>
              <span className="text-muted-foreground">in the last hour</span>
            </div>

            <div
              className="animate-float card-soft absolute -bottom-6 left-6 flex items-center gap-2 p-3 text-xs"
              style={{ animationDelay: "0.8s" }}
            >
              <Users className="size-4 text-primary" />
              <span className="font-semibold">Ahmed Cooks</span>
              <span className="text-muted-foreground">started following you</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-semibold">Trending Recipes</h2>
            <p className="text-muted-foreground">What the community is cooking this week.</p>
          </div>
          <Button asChild variant="soft" size="sm">
            <Link to="/explore">See all <ArrowRight /></Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recipes.slice(0, 4).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Cuisines */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-14 lg:px-8">
        <h2 className="mb-6 text-3xl font-semibold">Popular Cuisines</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cuisines.slice(0, 8).map((cuisine) => (
            <CuisineCard key={cuisine.slug} {...cuisine} />
          ))}
        </div>
      </section>

      {/* Beginner */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-8">
        <div className="card-soft overflow-hidden p-6 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">New to Cooking? Start Here 👩‍🍳</h2>
              <p className="mt-1 text-muted-foreground">Seven forgiving recipes with tips for every step.</p>
            </div>
            <Button asChild variant="hero">
              <Link to="/beginner"><ChefHat /> Beginner section</Link>
            </Button>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {beginnerRecipes.slice(0, 4).map((item) => (
              <li key={item.title} className="flex items-center gap-3 rounded-2xl bg-muted p-3">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="size-14 rounded-xl object-cover"
                />
                <div className="text-sm">
                  <p className="font-medium">{item.title}</p>
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" /> Easy • {item.minutes} min • Beginner
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground lg:px-8">
          <Brand />
          <p>© {new Date().getFullYear()} Chulha. Cooked with love.</p>
          <Link to="/admin" className="hover:text-foreground">Admin portal</Link>
        </div>
      </footer>
    </div>
  );
}
