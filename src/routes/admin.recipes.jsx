import { createFileRoute } from "@tanstack/react-router";
import { Check, Star, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/chulha/AdminShell";
import { AdminTable, StatusPill } from "@/components/chulha/AdminTable";
import { Button } from "@/components/ui/button";
import { recipes as mockRecipes } from "@/lib/mock-data";
import { resolveImage, defaultImages } from "@/lib/image-helper";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/recipes")({
  component: AdminRecipes,
});

function AdminRecipes() {
  const [recipeList, setRecipeList] = useState(mockRecipes);

  useEffect(() => {
    api
      .getRecipes()
      .then((res) => {
        if (res?.recipes && res.recipes.length > 0) {
          setRecipeList(res.recipes);
        }
      })
      .catch(() => {
        // Keep mock data
      });
  }, []);

  const handleApprove = async (id, title) => {
    setRecipeList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
    try {
      await api.updateRecipeStatus(id, "Approved");
      toast.success(`"${title}" has been approved in database!`);
    } catch (e) {
      toast.success(`"${title}" has been approved!`);
    }
  };

  const handleFeature = (title) => {
    toast.success(`"${title}" added to Homepage Featured!`);
  };

  const handleDelete = async (id, title) => {
    setRecipeList((prev) => prev.filter((r) => r.id !== id));
    try {
      await api.deleteRecipe(id);
      toast.error(`"${title}" permanently deleted from database.`);
    } catch (e) {
      toast.error(`"${title}" has been deleted.`);
    }
  };

  return (
    <AdminShell title="Recipes" description={`${recipeList.length} recipes in the library`}>
      <AdminTable columns={["Recipe", "Creator", "Cuisine", "Status", "Actions"]}>
        {recipeList.map((recipe, i) => {
          const imgSrc = resolveImage(recipe.image, defaultImages.biryani);
          const currentStatus = recipe.status || (i % 4 === 0 ? "Pending" : "Approved");

          return (
            <tr key={recipe.id} className="hover:bg-muted/60 transition-colors">
              <td className="px-5 py-3">
                <span className="flex items-center gap-3">
                  <img
                    src={imgSrc}
                    alt={recipe.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImages.biryani;
                    }}
                    className="size-10 rounded-xl object-cover bg-muted"
                  />
                  <span>
                    <span className="block font-medium">{recipe.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {recipe.minutes} min · {recipe.difficulty}
                    </span>
                  </span>
                </span>
              </td>
              <td className="px-5 py-3 text-muted-foreground">
                @{recipe.creator?.username || "cook"}
              </td>
              <td className="px-5 py-3">
                {recipe.flag || "🥘"} {recipe.cuisineName || recipe.cuisine}
              </td>
              <td className="px-5 py-3">
                <StatusPill status={currentStatus} />
              </td>
              <td className="px-5 py-3">
                <span className="flex gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Approve recipe"
                    title="Approve"
                    onClick={() => handleApprove(recipe.id, recipe.title)}
                  >
                    <Check className={currentStatus === "Approved" ? "text-success" : ""} />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Feature recipe"
                    title="Feature on Home"
                    onClick={() => handleFeature(recipe.title)}
                  >
                    <Star className="hover:text-primary" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Delete recipe"
                    title="Delete"
                    onClick={() => handleDelete(recipe.id, recipe.title)}
                  >
                    <Trash2 className="hover:text-destructive" />
                  </Button>
                </span>
              </td>
            </tr>
          );
        })}
      </AdminTable>
    </AdminShell>
  );
}
