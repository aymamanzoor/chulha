import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function UserCard({ user, subtitle }) {
  const { user: currentUser } = useAuth();
  const [following, setFollowing] = useState(user.isFollowing || false);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please log in to follow other cooks.");
      return;
    }

    try {
      const res = await api.toggleFollow(user.id);
      if (res?.isFollowing !== undefined) {
        setFollowing(res.isFollowing);
        toast.success(res.message || (res.isFollowing ? `Following @${user.username}` : `Unfollowed @${user.username}`));
      } else {
        setFollowing((v) => !v);
        toast.success(following ? `Unfollowed @${user.username}` : `Following @${user.username}`);
      }
    } catch (e) {
      setFollowing((v) => !v);
      toast.success(following ? `Unfollowed @${user.username}` : `Following @${user.username}`);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        to="/profile/$username"
        params={{ username: user.username }}
        className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-lg"
      >
        {user.emoji || "👩‍🍳"}
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          to="/profile/$username"
          params={{ username: user.username }}
          className="block truncate text-sm font-semibold hover:text-primary"
        >
          {user.name}
        </Link>
        <p className="truncate text-xs text-muted-foreground">
          {subtitle ?? `@${user.username}`}
        </p>
      </div>
      <Button
        size="sm"
        variant={following ? "soft" : "default"}
        onClick={handleFollowToggle}
      >
        {following ? "Following" : "Follow"}
      </Button>
    </div>
  );
}
