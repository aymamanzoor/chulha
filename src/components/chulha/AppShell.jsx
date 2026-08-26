import { Link } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  ChefHat,
  Compass,
  Globe2,
  Home,
  LogOut,
  PlusCircle,
  Shield,
  Sparkles,
  ShoppingCart,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useGrocery } from "@/context/GroceryContext";

export function Brand({ className }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
        <ChefHat className="size-5" />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">Chulha</span>
    </Link>
  );
}

export function AppShell({ children, rightSidebar }) {
  const { user, logout } = useAuth();
  const { list } = useGrocery();

  const profileUsername = user?.username || "sarahkitchen";

  const navItems = [
    { to: "/feed", label: "Home", icon: Home },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/cuisines", label: "Cuisines", icon: Globe2 },
    { to: "/beginner", label: "Beginner", icon: Sparkles },
    { to: "/grocery-list", label: "Grocery List", icon: ShoppingCart, badge: list.length > 0 ? list.length : null },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/profile/$username", label: "Profile", icon: UserIcon, params: { username: profileUsername } },
  ];

  const mobileItems = [
    { to: "/feed", label: "Home", icon: Home },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/grocery-list", label: "List", icon: ShoppingCart, badge: list.length > 0 ? list.length : null },
    { to: "/notifications", label: "Alerts", icon: Bell },
    { to: "/profile/$username", label: "You", icon: UserIcon, params: { username: profileUsername } },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="soft">
            <Link to="/beginner">
              <BookOpen /> Learn
            </Link>
          </Button>
          <Button asChild size="icon-sm" variant="ghost" aria-label="Admin portal">
            <Link to="/admin">
              <Shield />
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 pb-24 lg:px-6 lg:pb-10">
        {/* Desktop sidebar */}
        <aside className="sticky top-2 hidden h-[calc(100vh-1rem)] w-56 shrink-0 flex-col gap-2 overflow-hidden pb-2 lg:flex">
          <Brand className="scale-90 origin-left -ml-1" />
          <nav className="flex flex-col gap-0">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                {...(item.params ? { params: item.params } : {})}
                className="flex items-center justify-between rounded-full px-3 py-1 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                activeProps={{ className: "bg-accent text-accent-foreground font-semibold" }}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="size-[14px]" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <Button asChild variant="hero" size="sm" className="w-full shrink-0 h-8 text-[13px]">
            <Link to="/create">
              <PlusCircle className="mr-1.5 size-3.5" /> Create
            </Link>
          </Button>

          <div className="mt-1 space-y-0 pt-1 border-t border-border">
            {user ? (
              <div className="flex items-center justify-between gap-1 px-2 py-0.5">
                <Link
                  to="/profile/$username"
                  params={{ username: user.username }}
                  className="flex items-center gap-1.5 min-w-0 flex-1 hover:opacity-80"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-[10px]">
                    {user.emoji || "👩‍🍳"}
                  </span>
                  <span className="truncate text-[11px] font-semibold">{user.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    toast("Logged out");
                  }}
                  title="Log out"
                  className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-destructive cursor-pointer"
                >
                  <LogOut className="size-3" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-0">
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <UserIcon className="size-[12px]" /> Log in
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium text-primary hover:bg-primary/10"
                >
                  <Sparkles className="size-[12px]" /> Join free
                </Link>
              </div>
            )}

            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-full px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Shield className="size-[12px]" /> Admin portal
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1 py-6 min-h-[150vh]">{children}</main>

        {rightSidebar && (
          <aside className="sticky top-6 hidden self-start h-fit w-80 shrink-0 space-y-3 py-3 xl:block">
            {rightSidebar}
          </aside>
        )}
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-background/95 px-2 py-2 backdrop-blur lg:hidden">
        {mobileItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            {...(item.params ? { params: item.params } : {})}
            className="group relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[0.65rem] text-muted-foreground"
            activeProps={{ className: "text-primary font-semibold" }}
          >
            <div className="relative">
              <item.icon className="size-5" />
              {item.badge && (
                <span className="absolute -right-2 -top-1.5 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground border-2 border-background">
                  {item.badge}
                </span>
              )}
            </div>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
