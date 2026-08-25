import { createFileRoute } from "@tanstack/react-router";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/chulha/AppShell";
import { CuisineCard } from "@/components/chulha/CuisineCard";
import { cuisines as mockCuisines } from "@/lib/mock-data";
import { api } from "@/lib/api";

export const Route = createFileRoute("/cuisines/")({
  component: CuisinesPage,
});

function CuisinesPage() {
  const [cuisinesList, setCuisinesList] = useState(mockCuisines);

  useEffect(() => {
    api.getCuisines().then((res) => {
      if (res?.cuisines && res.cuisines.length > 0) {
        setCuisinesList(res.cuisines);
      }
    }).catch(() => {});
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold sm:text-4xl">Cuisines</h1>
          <p className="text-muted-foreground">
            Pick a kitchen and see what the community is cooking there.
          </p>
        </header>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cuisinesList.map((cuisine) => (
            <CuisineCard key={cuisine.slug} {...cuisine} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
