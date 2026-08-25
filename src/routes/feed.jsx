import { createFileRoute, Link } from "@tanstack/react-router";
import { ImagePlus, Lightbulb, NotebookPen } from "lucide-react";
import { useState, useEffect } from "react";

import { AppShell } from "@/components/chulha/AppShell";
import { PostCard } from "@/components/chulha/PostCard";
import { SuggestedUsersPanel, TrendingRecipesPanel } from "@/components/chulha/Sidebars";
import { Button } from "@/components/ui/button";
import { posts as mockPosts, users } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/feed")({
  component: Feed,
});

function Feed() {
  const [feedPosts, setFeedPosts] = useState(mockPosts);
  const { user } = useAuth();

  useEffect(() => {
    api
      .getPosts()
      .then((res) => {
        if (res?.posts && res.posts.length > 0) {
          setFeedPosts(res.posts);
        }
      })
      .catch(() => {
        // Keep mock data as fallback
      });
  }, []);

  const currentUserEmoji = user?.emoji || users[0].emoji;

  return (
    <AppShell
      rightSidebar={
        <>
          <TrendingRecipesPanel />
          <SuggestedUsersPanel />
        </>
      }
    >
      <div className="mx-auto max-w-xl space-y-5">
        <h1 className="sr-only">Your Chulha food feed</h1>
        <div className="card-soft p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-secondary text-lg">
              {currentUserEmoji}
            </span>
            <Link
              to="/create"
              className="flex h-11 flex-1 items-center rounded-full bg-muted px-4 text-sm text-muted-foreground hover:bg-accent"
            >
              Share what you cooked today...
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="soft">
              <Link to="/create"><ImagePlus /> Food photo</Link>
            </Button>
            <Button asChild size="sm" variant="soft">
              <Link to="/create"><NotebookPen /> Recipe</Link>
            </Button>
            <Button asChild size="sm" variant="soft">
              <Link to="/create"><Lightbulb /> Tip</Link>
            </Button>
          </div>
        </div>

        {feedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </AppShell>
  );
}
