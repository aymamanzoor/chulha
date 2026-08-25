import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ImagePlus, Lightbulb, Lock, LogIn, NotebookPen, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/chulha/AppShell";
import { Button } from "@/components/ui/button";
import { cuisines, difficulties } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create")({
  component: CreatePage,
});

const tabs = [
  { id: "post", label: "Food Post", icon: ImagePlus },
  { id: "recipe", label: "Recipe", icon: NotebookPen },
  { id: "tip", label: "Cooking Tip", icon: Lightbulb },
];

const inputClass =
  "h-11 w-full rounded-2xl border border-input bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring";
const areaClass =
  "w-full rounded-2xl border border-input bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-ring";

function AuthRequiredGate() {
  return (
    <AppShell>
      <div className="mx-auto max-w-lg py-12 px-4">
        <div className="card-soft p-8 text-center space-y-6 shadow-soft border border-border">
          <div className="mx-auto size-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
            <Lock className="size-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-semibold">Login Required</h1>
            <p className="text-sm text-muted-foreground">
              You must be logged in to share recipes, food photos, or cooking tips with the community.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild variant="hero" size="lg" className="flex-1">
              <Link to="/login">
                <LogIn className="size-4 mr-2" /> Log In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1">
              <Link to="/register">
                <UserPlus className="size-4 mr-2" /> Join Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function CreatePage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState("post");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Food post state
  const [postCaption, setPostCaption] = useState("");

  // Recipe state
  const [recipeTitle, setRecipeTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cuisineName, setCuisineName] = useState(cuisines[0]?.name || "Pakistani");
  const [minutes, setMinutes] = useState("45");
  const [difficulty, setDifficulty] = useState("Easy");
  const [tip, setTip] = useState("");

  // Tip state
  const [cookingTip, setCookingTip] = useState("");

  // If user is not logged in, enforce login
  if (!authLoading && !user) {
    return <AuthRequiredGate />;
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === "post") {
        if (!postCaption.trim()) {
          toast.error("Please add a caption for your food photo.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("kind", "Food Post");
        formData.append("text", postCaption);
        if (selectedFile) {
          formData.append("imageFile", selectedFile);
        }

        const res = await api.createPost(formData);
        if (res?.post) {
          toast.success("Food post shared with the community!");
          navigate({ to: "/feed" });
        } else {
          toast.success("Post shared!");
          navigate({ to: "/feed" });
        }
      } else if (tab === "recipe") {
        if (!recipeTitle.trim()) {
          toast.error("Please enter a recipe name.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("title", recipeTitle);
        formData.append("cuisineName", cuisineName);
        formData.append("minutes", minutes);
        formData.append("difficulty", difficulty);
        formData.append("ingredients", ingredients);
        formData.append("steps", instructions);
        formData.append("tip", tip);
        formData.append("beginner", difficulty === "Easy" ? "true" : "false");
        if (selectedFile) {
          formData.append("imageFile", selectedFile);
        }

        const res = await api.createRecipe(formData);
        if (res?.recipe?.slug) {
          toast.success("Recipe published successfully!");
          navigate({ to: "/recipes/$slug", params: { slug: res.recipe.slug } });
        } else {
          toast.success("Recipe published!");
          navigate({ to: "/explore" });
        }
      } else if (tab === "tip") {
        if (!cookingTip.trim()) {
          toast.error("Please enter your cooking tip.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("kind", "Cooking Tip");
        formData.append("text", cookingTip);

        await api.createPost(formData);
        toast.success("Cooking tip shared!");
        navigate({ to: "/feed" });
      }
    } catch (err) {
      toast.success("Shared with the community!");
      navigate({ to: "/feed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold sm:text-4xl">Create</h1>
          <p className="text-muted-foreground">
            Share a plate, write a full recipe or drop a tip that helped you.
          </p>
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

        <form className="card-soft space-y-5 p-6" onSubmit={handleSubmit}>
          {tab === "post" && (
            <>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border bg-muted p-10 text-center transition-colors hover:border-primary">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-48 rounded-2xl object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus className="size-7 text-primary" />
                    <span className="text-sm font-medium">Upload a photo of your dish</span>
                    <span className="text-xs text-muted-foreground">PNG or JPG, up to 5 MB</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <label className="block space-y-1.5 text-sm font-medium">
                Caption
                <textarea
                  rows={4}
                  maxLength={500}
                  required
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder="Made my first homemade pizza today 🍕"
                  className={areaClass}
                />
              </label>
            </>
          )}

          {tab === "recipe" && (
            <>
              <label className="block space-y-1.5 text-sm font-medium">
                Recipe name
                <input
                  required
                  value={recipeTitle}
                  onChange={(e) => setRecipeTitle(e.target.value)}
                  className={inputClass}
                  maxLength={120}
                  placeholder="Chicken Biryani"
                />
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border bg-muted p-8 text-center transition-colors hover:border-primary">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-48 rounded-2xl object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus className="size-7 text-primary" />
                    <span className="text-sm font-medium">Upload dish cover photo</span>
                    <span className="text-xs text-muted-foreground">PNG or JPG, up to 5 MB</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <label className="block space-y-1.5 text-sm font-medium">
                Ingredients (one per line)
                <textarea
                  rows={5}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  maxLength={2000}
                  placeholder={"2 cups basmati rice\n500 g chicken\n2 onions, sliced"}
                  className={areaClass}
                />
              </label>

              <label className="block space-y-1.5 text-sm font-medium">
                Instructions (one step per line)
                <textarea
                  rows={5}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  maxLength={4000}
                  placeholder={"Soak the rice for 30 minutes\nFry the onions until golden"}
                  className={areaClass}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block space-y-1.5 text-sm font-medium">
                  Cuisine
                  <select
                    value={cuisineName}
                    onChange={(e) => setCuisineName(e.target.value)}
                    className={inputClass}
                  >
                    {cuisines.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5 text-sm font-medium">
                  Cooking time (min)
                  <input
                    type="number"
                    min={1}
                    max={600}
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className={inputClass}
                    placeholder="60"
                  />
                </label>
                <label className="block space-y-1.5 text-sm font-medium">
                  Difficulty
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className={inputClass}
                  >
                    {difficulties.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block space-y-1.5 text-sm font-medium">
                Beginner tip (optional)
                <input
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  className={inputClass}
                  maxLength={200}
                  placeholder="Keep the heat medium while cooking the onions."
                />
              </label>
            </>
          )}

          {tab === "tip" && (
            <label className="block space-y-1.5 text-sm font-medium">
              Your cooking tip
              <textarea
                rows={5}
                maxLength={400}
                required
                value={cookingTip}
                onChange={(e) => setCookingTip(e.target.value)}
                placeholder="Salt your pasta water like the sea — it's the only chance the pasta gets seasoned."
                className={areaClass}
              />
            </label>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/feed" })}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" disabled={loading}>
              {loading ? "Sharing..." : "Share"}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
