import { createFileRoute } from "@tanstack/react-router";
import { Bell, Bookmark, Heart, MessageCircle, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/chulha/AppShell";
import { SuggestedUsersPanel } from "@/components/chulha/Sidebars";
import { Button } from "@/components/ui/button";
import { notifications as mockNotifications } from "@/lib/mock-data";
import { api } from "@/lib/api";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

const icons = {
  like: Heart,
  follow: UserPlus,
  comment: MessageCircle,
  save: Bookmark,
};

function NotificationsPage() {
  const [items, setItems] = useState(mockNotifications);

  useEffect(() => {
    api
      .getNotifications()
      .then((res) => {
        if (res?.notifications && res.notifications.length > 0) {
          setItems(res.notifications);
        }
      })
      .catch(() => {
        // Fallback to mock data
      });
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markNotificationsRead();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.success("All notifications marked as read");
    }
  };

  return (
    <AppShell rightSidebar={<SuggestedUsersPanel />}>
      <div className="mx-auto max-w-xl space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="inline-flex items-center gap-2 text-3xl font-semibold">
            <Bell className="size-6 text-primary" /> Notifications
          </h1>
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        </div>

        <ul className="card-soft divide-y divide-border overflow-hidden">
          {items.map((item) => {
            const Icon = icons[item.type] || Bell;
            return (
              <li key={item.id} className="flex items-center gap-3 p-4">
                <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-lg">
                  {item.user?.emoji || "👩‍🍳"}
                  <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-3" />
                  </span>
                </span>
                <p className="min-w-0 flex-1 text-sm">
                  <span className="font-semibold">{item.user?.name || "Cook"}</span>{" "}
                  <span className="text-muted-foreground">{item.action}</span>
                </p>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </AppShell>
  );
}
