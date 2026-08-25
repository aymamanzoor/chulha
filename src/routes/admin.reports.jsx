import { createFileRoute } from "@tanstack/react-router";
import { Check, Eye, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/chulha/AdminShell";
import { StatusPill } from "@/components/chulha/AdminTable";
import { Button } from "@/components/ui/button";
import { adminReports as mockReports } from "@/lib/mock-data";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReports,
});

function AdminReports() {
  const [reportsList, setReportsList] = useState(mockReports);

  useEffect(() => {
    api
      .getAdminReports()
      .then((res) => {
        if (res?.reports && res.reports.length > 0) {
          setReportsList(res.reports);
        }
      })
      .catch(() => {
        // Fallback
      });
  }, []);

  const handleDismiss = async (id) => {
    setReportsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Dismissed" } : r))
    );
    try {
      await api.updateReportStatus(id, "Dismissed");
      toast("Report dismissed and saved in database.");
    } catch (e) {
      toast("Report dismissed.");
    }
  };

  const handleResolve = async (id) => {
    setReportsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Resolved" } : r))
    );
    try {
      await api.updateReportStatus(id, "Resolved");
      toast.success("Report marked as resolved in database!");
    } catch (e) {
      toast.success("Report resolved.");
    }
  };

  const handleRemoveContent = async (id) => {
    setReportsList((prev) => prev.filter((r) => r.id !== id));
    try {
      await api.deleteReport(id);
      toast.error("Report deleted permanently.");
    } catch (e) {
      toast.error("Report deleted locally.");
    }
  };

  return (
    <AdminShell title="Reports" description={`${reportsList.length} reports in the moderation queue`}>
      <div className="space-y-4">
        {reportsList.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No reports in the queue.</p>
        ) : (
          reportsList.map((report) => (
            <div
              key={report.id}
              className="card-soft flex flex-col md:flex-row md:items-center justify-between p-5 gap-5 transition-shadow hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusPill status={report.status} />
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {report.type}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Reported by <span className="text-foreground">@{report.reporter?.username || "cook"}</span>
                  </span>
                </div>
                <h3 className="text-lg font-medium">{report.target}</h3>
                <p className="text-sm text-muted-foreground">
                  Reason for report: <span className="font-medium text-foreground">{report.reason}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0 md:pl-5 md:border-l border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent hover:bg-success/10 hover:text-success hover:border-success"
                  onClick={() => handleResolve(report.id)}
                >
                  <Check className="mr-1.5 size-4" /> Resolve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                  onClick={() => handleRemoveContent(report.id)}
                >
                  <Trash2 className="mr-1.5 size-4" /> Delete Report
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => handleDismiss(report.id)}
                  title="Dismiss report"
                >
                  <X className="mr-1.5 size-4" /> Dismiss
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminShell>
  );
}
