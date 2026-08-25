import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChefHat,
  Flag,
  Globe2,
  Image,
  LayoutDashboard,
  MessageSquare,
  Settings,
  UtensilsCrossed,
  Users,
  ShieldCheck,
  LogOut,
  Lock,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/recipes", label: "Recipes", icon: UtensilsCrossed },
  { to: "/admin/posts", label: "Posts", icon: Image },
  { to: "/admin/comments", label: "Comments", icon: MessageSquare },
  { to: "/admin/cuisines", label: "Cuisines", icon: Globe2 },
  { to: "/admin/reports", label: "Reports", icon: Flag },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminGate() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("sarah@chulha.app");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === "Admin" || res.user.role === "Moderator") {
          toast.success(`Welcome to Admin Console, ${res.user.name}!`);
        } else {
          toast.error("This account does not have Admin or Moderator permissions.");
        }
      } else {
        toast.error(res.message || "Invalid Admin email or password.");
      }
    } catch (err) {
      toast.error("Could not authenticate with server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sidebar/30 flex items-center justify-center p-4">
      <div className="card-soft max-w-md w-full p-6 space-y-4 shadow-soft border border-border max-h-screen overflow-y-auto no-scrollbar">
        <div className="text-center space-y-1.5">
          <div className="mx-auto size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Lock className="size-6 text-primary" />
          </div>
          <h1 className="font-display text-xl font-semibold">Admin Access Restricted</h1>
          <p className="text-sm text-muted-foreground leading-snug">
            Enter your administrator credentials to access the moderation console.
          </p>
        </div>

        {user && user.role === "Member" && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-3 text-xs text-destructive">
            <ShieldAlert className="size-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Logged in as @{user.username} (Member)</p>
              <p className="text-destructive/80 mt-0.5 leading-snug">
                Your current account is a regular member. Enter Admin credentials below to switch.
              </p>
            </div>
          </div>
        )}

        <form className="space-y-3" onSubmit={handleAdminAuth}>
          <label className="block space-y-1 text-sm font-medium">
            Admin Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@chulha.app"
              className="h-10 w-full rounded-2xl border border-input bg-card px-4 text-sm font-normal outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <label className="block space-y-1 text-sm font-medium">
            Admin Password
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-2xl border border-input bg-card px-4 text-sm font-normal outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </label>

          <Button type="submit" variant="hero" size="default" className="w-full mt-2" disabled={loading}>
            <KeyRound className="size-4 mr-1.5" />
            {loading ? "Authenticating..." : "Unlock Admin Portal"}
          </Button>
        </form>

        <div className="pt-1 text-center">
          <Button asChild variant="ghost" size="sm">
            <Link to="/feed">← Back to public website</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ title, description, actions, children }) {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // If still checking token, show lightweight spinner
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-sidebar/20">
        <p className="text-sm text-muted-foreground animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  // Security Check: Only Admin or Moderator allowed
  const isAuthorized = user && (user.role === "Admin" || user.role === "Moderator");

  if (!isAuthorized) {
    return <AdminGate />;
  }

  return (
    <div className="min-h-screen bg-sidebar/40 lg:flex">
      <aside className="border-b border-sidebar-border bg-sidebar px-4 py-4 lg:sticky lg:top-0 lg:self-start lg:h-fit lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:py-6 flex flex-col">
        <div>
          <Link to="/" className="flex items-center gap-2 px-2">
            <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <ChefHat className="size-5" />
            </span>
            <span>
              <span className="block font-display text-lg leading-tight font-semibold">Chulha</span>
              <span className="block text-xs text-muted-foreground">Admin portal</span>
            </span>
          </Link>

          {/* Logged in Admin Profile badge */}
          <div className="mt-4 rounded-2xl bg-card p-3 shadow-soft border border-border">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-secondary text-sm">
                {user?.emoji || "👑"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{user?.name}</p>
                <span className="inline-flex items-center gap-1 text-[0.68rem] text-primary font-medium">
                  <ShieldCheck className="size-3" /> {user?.role} Verified
                </span>
              </div>
            </div>
          </div>

          <nav className="mt-3 flex gap-0.5 overflow-x-auto lg:flex-col lg:overflow-visible">
            {adminNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/admin" }}
                activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" }}
                className="flex shrink-0 items-center gap-3 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
              >
                <item.icon className="size-[18px]" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-2 pt-3 border-t border-sidebar-border mt-4 lg:mt-4">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to="/feed">Back to app</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-destructive"
            onClick={() => {
              logout();
              toast("Admin logged out");
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="size-3.5 mr-1" /> Log out
          </Button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 min-h-[150vh]">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">{title}</h1>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </header>
        {children}
      </main>
    </div>
  );
}
