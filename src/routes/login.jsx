import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AuthLayout, SocialButtons } from "@/components/chulha/AuthLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        navigate({ to: "/feed" });
      } else {
        toast.error(res.message || "Invalid login credentials.");
      }
    } catch (err) {
      toast.error("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back, chef"
      subtitle="Log in to pick up where you left off."
      footer={
        <>
          New to Chulha?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-2" onSubmit={handleSubmit}>
        <label className="block text-xs font-medium">
          <span className="mb-0.5 block">Email</span>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              placeholder="you@example.com"
              className="h-9 w-full rounded-full border border-input bg-card pl-9 pr-4 text-xs font-normal outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </label>

        <label className="block text-xs font-medium">
          <span className="mb-0.5 block">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            placeholder="••••••••"
            className="h-9 w-full rounded-full border border-input bg-card px-4 text-xs font-normal outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <div className="flex items-center justify-between text-xs py-0.5">
          <label className="inline-flex items-center gap-1.5 text-muted-foreground">
            <input type="checkbox" className="size-3.5 accent-primary" /> Remember me
          </label>
          <button
            type="button"
            onClick={() => toast("Password reset link sent (demo)")}
            className="text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" variant="hero" size="sm" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <SocialButtons />
    </AuthLayout>
  );
}
