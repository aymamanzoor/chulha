import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { AppShell } from "@/components/chulha/AppShell";
import { RecipeCard } from "@/components/chulha/RecipeCard";
import { Button } from "@/components/ui/button";
import { categories, cuisines, difficulties, recipes as mockRecipes } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore")({
  component: Explore,
});

const timeOptions = [
  { label: "Any time", value: 0 },
  { label: "Under 20 min", value: 20 },
  { label: "Under 40 min", value: 40 },
  { label: "Under 60 min", value: 60 },
];

function Chip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm transition-colors cursor-pointer",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
    </button>
  );
}

function Explore() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cuisine, setCuisine] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [maxTime, setMaxTime] = useState(0);
  const [allRecipes, setAllRecipes] = useState(mockRecipes);
  const [showFilters, setShowFilters] = useState(false);

  const [magicInput, setMagicInput] = useState("");

  useEffect(() => {
    api
      .getRecipes()
      .then((res) => {
        if (res?.recipes && res.recipes.length > 0) {
          setAllRecipes(res.recipes);
        }
      })
      .catch(() => {
        // Fallback to mockRecipes
      });
  }, []);

  const results = useMemo(() => {
    let filtered = allRecipes.filter((recipe) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || recipe.title.toLowerCase().includes(q) || (recipe.ingredients && recipe.ingredients.some((i) => i.toLowerCase().includes(q)));
      const matchesCategory = category === "All" || recipe.category === category;
      const matchesCuisine = cuisine === "All" || recipe.cuisineName === cuisine || recipe.cuisine === cuisine;
      const matchesDifficulty = difficulty === "All" || recipe.difficulty === difficulty;
      const matchesTime = maxTime === 0 || recipe.minutes <= maxTime;

      return matchesQuery && matchesCategory && matchesCuisine && matchesDifficulty && matchesTime;
    });

    const magicTerms = magicInput.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);

    if (magicTerms.length > 0) {
      filtered = filtered
        .map((recipe) => {
          let score = 0;
          if (recipe.ingredients) {
            magicTerms.forEach((term) => {
              if (recipe.ingredients.some((ing) => ing.toLowerCase().includes(term))) {
                score++;
              }
            });
          }
          return { recipe, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.recipe);
    }

    return filtered;
  }, [allRecipes, query, category, cuisine, difficulty, maxTime, magicInput]);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold sm:text-4xl">Explore Recipes</h1>
          
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                maxLength={80}
                placeholder="Search recipes..."
                className="h-13 w-full rounded-2xl border border-input bg-card pl-11 pr-4 text-sm shadow-soft outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary" />
              <input
                value={magicInput}
                onChange={(e) => setMagicInput(e.target.value)}
                maxLength={100}
                placeholder="Leftover Magic (e.g. chicken, rice)"
                className="h-13 w-full rounded-2xl border border-primary/30 bg-primary/5 pl-11 pr-4 text-sm shadow-soft outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-primary/60"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Chip active={category === "All"} onClick={() => setCategory("All")}>All</Chip>
            {categories.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
            ))}
            <Chip active={showFilters} onClick={() => setShowFilters(!showFilters)}>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4" /> Filters
              </div>
            </Chip>
          </div>

          {showFilters && (
            <div className="card-soft flex flex-wrap items-center gap-4 p-4 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs text-muted-foreground">
                Cuisine
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="ml-2 h-9 rounded-full border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="All">All</option>
                  {cuisines.map((c) => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-muted-foreground">
                Difficulty
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="ml-2 h-9 rounded-full border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="All">All</option>
                  {difficulties.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-muted-foreground">
                Cooking time
                <select
                  value={maxTime}
                  onChange={(e) => setMaxTime(Number(e.target.value))}
                  className="ml-2 h-9 rounded-full border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                  {timeOptions.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </label>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                  setCuisine("All");
                  setDifficulty("All");
                  setMaxTime(0);
                }}
              >
                Reset
              </Button>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{results.length} recipes found</p>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {results.length === 0 && (
          <div className="card-soft p-10 text-center text-muted-foreground">
            No recipes matched those filters yet. Try clearing a filter.
          </div>
        )}
      </div>
    </AppShell>
  );
}
