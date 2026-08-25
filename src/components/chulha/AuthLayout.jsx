import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { Brand } from "@/components/chulha/AppShell";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/mock-data";

export function SocialButtons() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or continue with{" "}
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["Google", "Apple", "Facebook"].map((provider) => (
          <Button
            key={provider}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toast(`${provider} sign-in is a visual placeholder`)}
          >
            {provider}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-warm-glow flex flex-col justify-center px-6 py-1 sm:px-12">
        <div className="mx-auto w-full max-w-md space-y-2.5">
          <Brand />
          <div className="space-y-0.5">
            <h1 className="font-display text-xl font-semibold">{title}</h1>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className="card-soft space-y-3 p-4 shadow-soft">{children}</div>
          <div className="space-y-1.5 pt-0.5">
            <p className="text-center text-xs text-muted-foreground">{footer}</p>
            <p className="text-center text-[10px] text-muted-foreground">
              <Link to="/explore" className="hover:text-foreground">
                Browse recipes without an account →
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <img
          src={images.heroTable}
          alt="Home-cooked dishes on a warm table"
          loading="lazy"
          width={1408}
          height={1104}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/70 to-transparent" />
        <blockquote className="absolute bottom-10 left-10 right-10 font-display text-2xl text-background">
          &ldquo;I learned to cook here, one post at a time.&rdquo;
          <footer className="mt-2 text-sm text-background/70">— Sarah, home cook</footer>
        </blockquote>
      </div>
    </div>
  );
}
