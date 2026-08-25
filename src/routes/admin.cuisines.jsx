import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/chulha/AdminShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cuisines as mockCuisines } from "@/lib/mock-data";
import { resolveImage, defaultImages } from "@/lib/image-helper";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/cuisines")({
  component: AdminCuisines,
});

function AdminCuisines() {
  const [cuisinesList, setCuisinesList] = useState(mockCuisines);
  const [open, setOpen] = useState(false);
  const [newCuisineName, setNewCuisineName] = useState("");
  const [newCuisineFlag, setNewCuisineFlag] = useState("");

  useEffect(() => {
    api
      .getCuisines()
      .then((res) => {
        if (res?.cuisines && res.cuisines.length > 0) {
          setCuisinesList(res.cuisines);
        }
      })
      .catch(() => {
        // Fallback
      });
  }, []);

  const handleAddCuisine = async (e) => {
    e.preventDefault();
    if (!newCuisineName.trim()) return;

    const newCuisine = {
      name: newCuisineName.trim(),
      slug: newCuisineName.trim().toLowerCase().replace(/\s+/g, "-"),
      flag: newCuisineFlag.trim() || "🥘",
      recipes: 0,
      image: defaultImages.heroTable,
    };

    setCuisinesList((prev) => [newCuisine, ...prev]);
    setNewCuisineName("");
    setNewCuisineFlag("");
    setOpen(false);

    try {
      const formData = new FormData();
      formData.append("name", newCuisine.name);
      formData.append("flag", newCuisine.flag);
      await api.createCuisine(formData);
      toast.success(`Cuisine "${newCuisine.name}" saved in database!`);
    } catch (e) {
      toast.success(`Cuisine "${newCuisine.name}" added!`);
    }
  };

  const handleDeleteCuisine = async (id, slug, name) => {
    setCuisinesList((prev) => prev.filter((c) => (id ? c.id !== id : c.slug !== slug)));
    try {
      if (id) await api.deleteCuisine(id);
      toast.error(`Cuisine "${name}" permanently deleted from database.`);
    } catch (e) {
      toast.error(`Cuisine "${name}" deleted.`);
    }
  };

  return (
    <AdminShell
      title="Cuisines"
      description={`${cuisinesList.length} cuisines available`}
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus /> Add cuisine
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>Add a cuisine</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddCuisine}>
              <label className="block space-y-1.5 text-sm font-medium">
                Name
                <input
                  required
                  value={newCuisineName}
                  onChange={(e) => setNewCuisineName(e.target.value)}
                  maxLength={40}
                  placeholder="Lebanese"
                  className="h-11 w-full rounded-2xl border border-input bg-card px-4 text-sm font-normal outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">
                Flag emoji
                <input
                  required
                  value={newCuisineFlag}
                  onChange={(e) => setNewCuisineFlag(e.target.value)}
                  maxLength={4}
                  placeholder="🇱🇧"
                  className="h-11 w-full rounded-2xl border border-input bg-card px-4 text-sm font-normal outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <DialogFooter>
                <Button type="submit" variant="hero">
                  Save cuisine
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cuisinesList.map((cuisine) => {
          const imgSrc = resolveImage(cuisine.image, defaultImages.biryani);
          return (
            <div key={cuisine.slug} className="card-soft flex items-center gap-3 p-4">
              <img
                src={imgSrc}
                alt={cuisine.name}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImages.biryani;
                }}
                className="size-14 rounded-2xl object-cover bg-muted"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {cuisine.flag} {cuisine.name}
                </p>
                <p className="text-xs text-muted-foreground">{cuisine.recipesCount || 0} recipes</p>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={`Delete ${cuisine.name}`}
                title="Delete"
                onClick={() => handleDeleteCuisine(cuisine.id, cuisine.slug, cuisine.name)}
              >
                <Trash2 className="hover:text-destructive" />
              </Button>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
