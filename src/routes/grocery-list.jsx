import { createFileRoute } from "@tanstack/react-router";
import { Check, ShoppingCart, Trash2 } from "lucide-react";
import { AppShell } from "@/components/chulha/AppShell";
import { Button } from "@/components/ui/button";
import { useGrocery } from "@/context/GroceryContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/grocery-list")({
  component: GroceryListPage,
});

function GroceryListPage() {
  const { list, removeIngredient, clearList } = useGrocery();
  const [checkedItems, setCheckedItems] = useState(new Set());

  const toggleCheck = (item) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const handleRemove = (item) => {
    removeIngredient(item);
    if (checkedItems.has(item)) {
      const newChecked = new Set(checkedItems);
      newChecked.delete(item);
      setCheckedItems(newChecked);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="card-soft bg-warm-glow space-y-3 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-semibold inline-flex items-center gap-3">
                <ShoppingCart className="size-8 text-primary" /> Grocery List
              </h1>
              <p className="mt-2 text-muted-foreground">
                Your smart shopping list. Add ingredients from any recipe and track them here.
              </p>
            </div>
            {list.length > 0 && (
              <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={clearList}>
                <Trash2 className="mr-2 size-4" /> Clear All
              </Button>
            )}
          </div>
        </header>

        {list.length === 0 ? (
          <div className="card-soft flex min-h-[40vh] flex-col items-center justify-center p-10 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-secondary text-primary">
              <ShoppingCart className="size-8" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Your list is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Go explore some recipes and add their ingredients here!
            </p>
          </div>
        ) : (
          <div className="card-soft overflow-hidden">
            <ul className="divide-y divide-border">
              {list.map((item, idx) => {
                const isChecked = checkedItems.has(item);
                return (
                  <li key={idx} className={cn("flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent/50", isChecked && "opacity-60")}>
                    <button
                      onClick={() => toggleCheck(item)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <div
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded border transition-colors",
                          isChecked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"
                        )}
                      >
                        {isChecked && <Check className="size-3.5" />}
                      </div>
                      <span className={cn("text-sm transition-all", isChecked && "line-through text-muted-foreground")}>
                        {item}
                      </span>
                    </button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(item)} className="text-muted-foreground hover:text-destructive shrink-0">
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </AppShell>
  );
}
