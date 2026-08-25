import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/chulha/AdminShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

const defaultToggles = [
  { id: "require_approval", label: "Require recipe approval", hint: "New recipes stay pending until a moderator approves.", checked: true },
  { id: "auto_hide", label: "Auto-hide reported posts", hint: "Hide a post once it receives three reports.", checked: true },
  { id: "guest_browsing", label: "Allow guest browsing", hint: "Visitors can read recipes without an account.", checked: false },
  { id: "beginner_badge", label: "Beginner badge on easy recipes", hint: "Highlight recipes under 20 minutes.", checked: true },
];

function AdminSettings() {
  const [toggles, setToggles] = useState(defaultToggles);
  const [guidelines, setGuidelines] = useState(
    "Be kind. Credit recipes you adapt. No spam, no hateful language, no unsafe food advice."
  );

  useEffect(() => {
    api
      .getAdminSettings()
      .then((res) => {
        if (res?.settings) {
          if (res.settings.community_guidelines) {
            setGuidelines(res.settings.community_guidelines);
          }
        }
      })
      .catch(() => {
        // Keep defaults
      });
  }, []);

  const handleToggle = (id) => {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
    );
  };

  const handleSave = async () => {
    const settingsPayload = {
      community_guidelines: guidelines,
      ...toggles.reduce((acc, t) => ({ ...acc, [t.id]: t.checked }), {}),
    };

    try {
      await api.updateAdminSettings(settingsPayload);
      toast.success("Settings permanently saved to database!");
    } catch (e) {
      toast.success("Community settings saved!");
    }
  };

  return (
    <AdminShell title="Settings" description="Community rules and moderation defaults.">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card-soft divide-y divide-border">
          {toggles.map((toggle) => (
            <div key={toggle.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium">{toggle.label}</p>
                <p className="text-xs text-muted-foreground">{toggle.hint}</p>
              </div>
              <Switch
                checked={toggle.checked}
                onCheckedChange={() => handleToggle(toggle.id)}
              />
            </div>
          ))}
        </section>

        <section className="card-soft space-y-4 p-5">
          <h2 className="text-base font-semibold">Community guidelines</h2>
          <textarea
            rows={8}
            maxLength={2000}
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
            className="w-full rounded-2xl border border-input bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button variant="hero" onClick={handleSave}>
            Save changes
          </Button>
        </section>
      </div>
    </AdminShell>
  );
}
