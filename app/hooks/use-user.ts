"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { fetchCurrentUser } from "@/app/lib/api-client";
import type { CurrentUser } from "@/app/types/stream";

export function useUser() {
  const { status } = useSession();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const profile = await fetchCurrentUser();
      setUser(profile);
    } catch (loadError) {
      setUser(null);
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load profile",
      );
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  return {
    user,
    isLoading: status === "loading" || isLoading,
    error,
    isAuthenticated: status === "authenticated",
    isStreamer: user?.role === "Streamer",
    reload: loadUser,
  };
}
