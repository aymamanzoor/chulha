import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/chulha/AppShell";
import { RecipeCard } from "@/components/chulha/RecipeCard";
import { Button } from "@/components/ui/button";
import { cuisines, recipes as mockRecipes } from "@/lib/mock-data";
import { api } from "@/lib/api";

export const Route = createFileRoute("/cuisines/$slug")({
  loader: ({ params }) => {
    const cuisine = cuisines.find((c) => c.slug === params.slug);
    if (!cuisine) throw notFound();
    return { cuisine };
  },
  notFoundComponent: CuisineNotFound,
  errorComponent: CuisineNotFound,
  component: CuisinePage,
});

function CuisineNotFound() {
  return (
    <AppShell>
      <div className="card-soft p-10 text-center">
        <h1 className="text-2xl font-semibold">That cuisine isn&apos;t on the menu yet</h1>
        <Button asChild className="mt-6">
          <Link to="/cuisines">All cuisines</Link>
        </Button>
      </div>
    </AppShell>
  );
}

function CuisinePage() {
  const { cuisine } = Route.useLoaderData();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRecipes({ cuisine: cuisine.name }).then((res) => {
      if (res?.recipes) {
        setList(res.recipes);
      }
    }).catch(() => {
      // If API fails completely, use mock data
      const matches = mockRecipes.filter((r) => r.cuisine === cuisine.name || r.cuisineName === cuisine.name);
      setList(matches);
    }).finally(() => {
      setLoading(false);
    });
  }, [cuisine.name]);

  return (
    <AppShell>
      <div className="space-y-8">
        <Button asChild variant="ghost" size="sm">
          <Link to="/cuisines">
            <ArrowLeft /> All cuisines
          </Link>
        </Button>

        <header className="relative overflow-hidden rounded-3xl">
          <img
            src={cuisine.image}
            alt={`${cuisine.name} cuisine`}
            width={1024}
            height={768}
            className="h-56 w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-foreground/85 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <p className="text-3xl">{cuisine.flag}</p>
            <h1 className="font-display text-4xl font-semibold text-background">
              {cuisine.name} Recipes
            </h1>
            <p className="text-sm text-background/75">{cuisine.recipes} recipes in this kitchen</p>
          </div>
        </header>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Popular right now</h2>
          {loading ? (
            <p className="text-muted-foreground">Loading recipes...</p>
          ) : list.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          ) : (
            <div className="card-soft p-10 text-center">
              <h3 className="text-lg font-medium">No recipes found</h3>
              <p className="text-muted-foreground mt-2">There are no approved recipes for this cuisine yet.</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
