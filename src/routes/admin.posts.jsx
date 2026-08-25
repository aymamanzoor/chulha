import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag, MessageSquare, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/chulha/AdminShell";
import { AdminTable, StatusPill } from "@/components/chulha/AdminTable";
import { Button } from "@/components/ui/button";
import { posts as mockPosts } from "@/lib/mock-data";
import { resolveImage, defaultImages } from "@/lib/image-helper";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/posts")({
  component: AdminPosts,
});

function AdminPosts() {
  const [postsList, setPostsList] = useState(mockPosts);

  useEffect(() => {
    api
      .getPosts()
      .then((res) => {
        if (res?.posts && res.posts.length > 0) {
          setPostsList(res.posts);
        }
      })
      .catch(() => {
        // Keep mock data
      });
  }, []);

  const handleRemovePost = async (id) => {
    setPostsList((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.deletePost(id);
      toast.error("Post permanently deleted from database.");
    } catch (e) {
      toast.error("Post removed.");
    }
  };

  return (
    <AdminShell
      title="Posts"
      description={`${postsList.length} posts in the community`}
      actions={
        <Button asChild variant="outline">
          <Link to="/admin/reports">
            <Flag /> View reports
          </Link>
        </Button>
      }
    >
      <AdminTable columns={["Post", "Author", "Type", "Engagement", "Status", "Actions"]}>
        {postsList.map((post, i) => {
          const imgSrc = post.image ? resolveImage(post.image, defaultImages.pizza) : null;
          return (
            <tr key={post.id} className="hover:bg-muted/60 transition-colors">
              <td className="max-w-xs px-5 py-3">
                <span className="flex items-center gap-3">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImages.pizza;
                      }}
                      className="size-10 rounded-xl object-cover bg-muted"
                    />
                  ) : (
                    <span className="grid size-10 place-items-center rounded-xl bg-muted">💡</span>
                  )}
                  <span className="line-clamp-2 text-sm">{post.text}</span>
                </span>
              </td>
              <td className="px-5 py-3 text-muted-foreground">@{post.user?.username || "cook"}</td>
              <td className="px-5 py-3">{post.kind || "Food Post"}</td>
              <td className="px-5 py-3 text-muted-foreground">
                {post.likes || 12} likes · {post.commentCount || 0} comments
              </td>
              <td className="px-5 py-3">
                <StatusPill status={i === 2 ? "Reported" : "Published"} />
              </td>
              <td className="px-5 py-3">
                <span className="flex gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Remove post"
                    title="Remove post"
                    onClick={() => handleRemovePost(post.id)}
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
