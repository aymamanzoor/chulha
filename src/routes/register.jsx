import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthLayout, SocialButtons } from "@/components/chulha/AuthLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mismatch) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // Auto-generate username from email
      const generatedUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000);
      
      const res = await register(name, generatedUsername, email, password);
      if (res.success) {
        toast.success("Account created successfully!");
        navigate({ to: "/feed" });
      } else {
        toast.error(res.message || "Registration failed.");
      }
    } catch (err) {
      toast.error("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join the kitchen"
      subtitle="Create an account and share your first dish today."
      footer={
        <>
          Already cooking with us?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-2" onSubmit={handleSubmit}>
        <label className="block text-xs font-medium">
          <span className="mb-0.5 block">Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            placeholder="Sarah Khan"
            className="h-9 w-full rounded-full border border-input bg-card px-4 text-xs font-normal outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <label className="block text-xs font-medium">
          <span className="mb-0.5 block">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            placeholder="you@example.com"
            className="h-9 w-full rounded-full border border-input bg-card px-4 text-xs font-normal outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <label className="block text-xs font-medium">
          <span className="mb-0.5 block">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="h-9 w-full rounded-full border border-input bg-card px-4 text-xs font-normal outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <label className="block text-xs font-medium relative">
          <span className="mb-0.5 block">Confirm Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            className="h-9 w-full rounded-full border border-input bg-card px-4 text-xs font-normal outline-none focus:ring-2 focus:ring-ring"
          />
          {mismatch && <span className="absolute -bottom-3 left-4 text-[10px] text-destructive block">Passwords do not match</span>}
        </label>

        <div className="pt-1">
          <Button type="submit" variant="hero" size="sm" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </div>
      </form>

      <SocialButtons />
    </AuthLayout>
  );
}
