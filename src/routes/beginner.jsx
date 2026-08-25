import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Lightbulb, Sparkles } from "lucide-react";

import { AppShell } from "@/components/chulha/AppShell";
import { beginnerRecipes, recipes } from "@/lib/mock-data";

export const Route = createFileRoute("/beginner")({
  component: BeginnerPage,
});

const tips = [
  "Read the whole recipe before you turn on the stove.",
  "Prepare and measure everything first — it removes the panic.",
  "Medium heat is your friend; high heat burns before it cooks.",
  "Taste as you go and season in small steps.",
];

function BeginnerPage() {
  return (
    <AppShell>
      <div className="space-y-10">
        <header className="card-soft bg-warm-glow space-y-3 p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5 text-primary" /> Beginner section
          </span>
          <h1 className="font-display text-4xl font-semibold">New to Cooking? Start Here 👩‍🍳</h1>
          <p className="max-w-xl text-muted-foreground">
            Seven forgiving recipes that teach the basics: heat control, seasoning and timing. No fancy equipment needed.
          </p>
        </header>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Your first seven recipes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {beginnerRecipes.map((item) => {
              const card = (
                <>
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-40 w-full object-cover"
                  />
                  <div className="space-y-1 p-4">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3.5" /> Easy • {item.minutes} min • Beginner
                    </p>
                  </div>
                </>
              );
              return item.slug ? (
                <Link
                  key={item.title}
                  to="/recipes/$slug"
                  params={{ slug: item.slug }}
                  className="card-soft hover-lift overflow-hidden"
                >
                  {card}
                </Link>
              ) : (
                <article key={item.title} className="card-soft hover-lift overflow-hidden">
                  {card}
                </article>
              );
            })}
          </div>
        </section>

        <section className="card-soft space-y-4 p-6">
          <h2 className="inline-flex items-center gap-2 text-2xl font-semibold">
            <Lightbulb className="size-5 text-primary" /> Four habits of confident cooks
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {tips.map((tip, i) => (
              <li key={tip} className="flex gap-3 rounded-2xl bg-muted p-4 text-sm">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Easy recipes from the community</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {recipes
              .filter((r) => r.difficulty === "Easy")
              .map((r) => (
                <li key={r.id}>
                  <Link
                    to="/recipes/$slug"
                    params={{ slug: r.slug }}
                    className="card-soft flex items-center gap-3 p-3 transition-colors hover:bg-accent"
                  >
                    <img
                      src={r.image}
                      alt={r.title}
                      loading="lazy"
                      width={1024}
                      height={768}
                      className="size-14 rounded-xl object-cover"
                    />
                    <span>
                      <span className="block text-sm font-medium">{r.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        by {r.creator.name} · {r.minutes} min
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
