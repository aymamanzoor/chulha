import { createFileRoute } from "@tanstack/react-router";
import { Ban, CheckCircle, Eye, Pencil, Trash2, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/chulha/AdminShell";
import { AdminTable, StatusPill } from "@/components/chulha/AdminTable";
import { Button } from "@/components/ui/button";
import { adminUsers as mockUsers } from "@/lib/mock-data";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const [usersList, setUsersList] = useState(mockUsers);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api
      .getAdminUsers()
      .then((res) => {
        if (res?.users && res.users.length > 0) {
          setUsersList(res.users);
        }
      })
      .catch(() => {
        // Fallback
      });
  }, []);

  const handleToggleSuspend = async (userId, currentStatus) => {
    const nextStatus = currentStatus === "Suspended" ? "Active" : "Suspended";
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
    );
    try {
      await api.updateAdminUser(userId, { status: nextStatus });
      toast[nextStatus === "Suspended" ? "warning" : "success"](
        `User status saved as ${nextStatus} in database`
      );
    } catch (e) {
      toast[nextStatus === "Suspended" ? "warning" : "success"](
        `User status changed to ${nextStatus}`
      );
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === "Admin" ? "Member" : "Admin";
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
    );
    try {
      await api.updateAdminUser(userId, { role: nextRole });
      toast.success(`User role saved as ${nextRole} in database!`);
    } catch (e) {
      toast.success(`User role updated to ${nextRole}`);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    try {
      await api.deleteAdminUser(userId);
      toast.error(`@${username} permanently removed from database.`);
    } catch (e) {
      toast.error(`@${username} has been removed.`);
    }
  };

  const rows = usersList.filter((u) =>
    `${u.name} ${u.username} ${u.email || ""}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <AdminShell
      title="Users"
      description={`${usersList.length} registered members`}
      actions={
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={60}
          placeholder="Search users..."
          className="h-10 w-56 rounded-full border border-input bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring shadow-soft"
        />
      }
    >
      <AdminTable columns={["Name", "Username", "Email", "Role", "Status", "Actions"]}>
        {rows.map((user) => (
          <tr key={user.id} className="hover:bg-muted/60 transition-colors">
            <td className="px-5 py-3">
              <span className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-secondary">
                  {user.emoji || "👩‍🍳"}
                </span>
                <span className="font-medium">{user.name}</span>
              </span>
            </td>
            <td className="px-5 py-3 text-muted-foreground">@{user.username}</td>
            <td className="px-5 py-3 text-muted-foreground">{user.email || `${user.username}@chulha.app`}</td>
            <td className="px-5 py-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${user.role === "Admin" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                {user.role}
              </span>
            </td>
            <td className="px-5 py-3">
              <StatusPill status={user.status} />
            </td>
            <td className="px-5 py-3">
              <span className="flex gap-1">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Toggle role"
                  title="Make Admin/Member"
                  onClick={() => handleToggleRole(user.id, user.role)}
                >
                  <UserCheck className={user.role === "Admin" ? "text-primary" : ""} />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Suspend user"
                  title="Toggle Suspend"
                  onClick={() => handleToggleSuspend(user.id, user.status)}
                >
                  <Ban className={user.status === "Suspended" ? "text-destructive" : ""} />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Delete user"
                  title="Delete user"
                  onClick={() => handleDeleteUser(user.id, user.username)}
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
