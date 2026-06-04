"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import { useSpotifyAvailability } from "@/app/hooks/use-spotify-availability";

type Track = {
  id: string;
  name: string;
  artists: { name: string }[];
  uri: string;
  album: { images: { url: string }[] };
};

export default function SpotifyDashboard() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);
  const { availability, loading: availabilityLoading } = useSpotifyAvailability();

  async function search(query?: string) {
    const term = (query ?? q).trim();
    if (!term) return setResults([]);
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      setResults(data.tracks?.items ?? []);
    } catch (e: any) {
      setMsg("Search failed");
    }
    setLoading(false);
  }

  // debounce input
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      search(q);
    }, 350);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [q]);

  async function addToQueue(uri: string) {
    setMsg(null);
    try {
      const res = await fetch(`/api/spotify/queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uri }),
      });
      const data = await res.json();
      if (data.ok) setMsg("Added to queue");
      else setMsg(data.error ?? "Failed to add");
    } catch (e) {
      setMsg("Failed to add to queue");
    }
  }

  function handleSearchClick() {
    search();
  }

  if (availabilityLoading) {
    return (
      <div className="glass-panel p-6 text-center text-sm text-muted">
        Checking Spotify configuration...
      </div>
    );
  }

  if (availability && !availability.enabled) {
    return (
      <div className="glass-panel p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Spotify integration unavailable</h1>
        <p className="text-sm text-muted">{availability.message}</p>
        <div className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
          To enable Spotify features, add the following values to your `.env` file and restart the app:
          <pre className="mt-3 rounded bg-slate-950/5 p-3 text-xs text-slate-700">
            SPOTIFY_CLIENT_ID=&lt;your Spotify client id&gt;
            SPOTIFY_CLIENT_SECRET=&lt;your Spotify client secret&gt;
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Spotify</h1>
        <p className="text-sm text-muted">Search Spotify and add tracks to your playback queue.</p>
      </div>

      <div className="glass-panel p-4">
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for a track, artist, or album"
            className="flex-1 rounded-lg border border-border px-3 py-2"
          />
          <Button onClick={handleSearchClick} disabled={loading}>{loading ? "Searching..." : "Search"}</Button>
        </div>

        {msg ? <div className="mt-3 text-sm text-muted">{msg}</div> : null}

        <div className="mt-4 space-y-3">
          {results.map((t) => (
            <div key={t.id} className="flex items-center gap-3">
              {t.album?.images?.[2] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.album.images[2].url} alt="" className="h-12 w-12 rounded" />
              ) : (
                <div className="h-12 w-12 rounded bg-surface" />
              )}
              <div className="flex-1">
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-muted">{t.artists.map((a) => a.name).join(", ")}</div>
              </div>
              <div>
                <Button onClick={() => addToQueue(t.uri)}>Add to queue</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
