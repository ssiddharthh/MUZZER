"use client";

import { useEffect, useState } from "react";

type SpotifyAvailability = {
  enabled: boolean;
  message: string;
};

export function useSpotifyAvailability() {
  const [availability, setAvailability] = useState<SpotifyAvailability | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchAvailability() {
      try {
        const res = await fetch("/api/spotify/availability");
        const data = await res.json();
        if (active) {
          setAvailability(data);
        }
      } catch (error) {
        if (active) {
          setAvailability({
            enabled: false,
            message: "Unable to verify Spotify configuration.",
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchAvailability();

    return () => {
      active = false;
    };
  }, []);

  return { availability, loading };
}
