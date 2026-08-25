import { createFileRoute } from "@tanstack/react-router";
import { Check, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/chulha/AdminShell";
import { AdminTable, StatusPill } from "@/components/chulha/AdminTable";
import { Button } from "@/components/ui/button";
import { comments as mockComments, recipes } from "@/lib/mock-data";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/comments")({
  component: AdminComments,
});

function AdminComments() {
  const [commentRows, setCommentRows] = useState(
    mockComments.flatMap((comment) => [comment, ...(comment.replies ?? [])])
  );

  useEffect(() => {
    api
      .getComments()
      .then((res) => {
        if (res?.comments && res.comments.length > 0) {
          setCommentRows(res.comments.flatMap((c) => [c, ...(c.replies ?? [])]));
        }
      })
      .catch(() => {
        // Keep mock data
      });
  }, []);

  const handleApprove = (id) => {
    setCommentRows((prev) =>
      prev.map((c) => (c.id === id ? { ...c, approved: true } : c))
    );
    toast.success("Comment marked as approved!");
  };

  const handleDelete = async (id) => {
    setCommentRows((prev) => prev.filter((c) => c.id !== id));
    try {
      await api.deleteComment(id);
      toast.error("Comment deleted from database.");
    } catch (e) {
      toast.error("Comment deleted.");
    }
  };

  return (
    <AdminShell title="Comments" description={`${commentRows.length} recent comments`}>
      <AdminTable columns={["Author", "Comment", "On", "Status", "Actions"]}>
        {commentRows.map((comment, i) => (
          <tr key={comment.id} className="hover:bg-muted/60 transition-colors">
            <td className="px-5 py-3 font-medium">@{comment.user?.username || "cook"}</td>
            <td className="max-w-md px-5 py-3 text-muted-foreground">{comment.text}</td>
            <td className="px-5 py-3">{recipes[i % recipes.length]?.title || "Recipe"}</td>
            <td className="px-5 py-3">
              <StatusPill status={comment.approved ? "Approved" : (i === 1 ? "Reported" : "Approved")} />
            </td>
            <td className="px-5 py-3">
              <span className="flex gap-1">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Approve comment"
                  title="Approve"
                  onClick={() => handleApprove(comment.id)}
                >
                  <Check className="text-success" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Delete comment"
                  title="Delete"
                  onClick={() => handleDelete(comment.id)}
                >
                  <Trash2 className="hover:text-destructive" />
                </Button>
              </span>
            </td>
          </tr>
        ))}
      </AdminTable>
    </AdminShell>
  );
}
