"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

type StreamFormProps = {
  onSubmit: (url: string) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
};

type SearchResult = {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  url: string;
};

export function StreamForm({
  onSubmit,
  isSubmitting = false,
  submitLabel = "Add to queue",
}: StreamFormProps) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<"youtube" | "spotify">("youtube");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.startsWith("http")) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const endpoint = platform === "youtube" ? `/api/youtube/search?q=${encodeURIComponent(query)}` : `/api/spotify/search?q=${encodeURIComponent(query)}`;
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          setResults(data || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, platform]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!query.trim()) {
      setError("Search for a song or paste a URL.");
      return;
    }

    // If it's a direct URL, submit it
    if (query.startsWith("http")) {
      await handleSelect(query);
    }
  }

  async function handleSelect(url: string) {
    try {
      setError(null);
      await onSubmit(url);
      setQuery("");
      setResults([]);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not add this track.",
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4 border-b border-border pb-4">
        <Button 
          variant={platform === "youtube" ? "primary" : "secondary"} 
          onClick={() => { setPlatform("youtube"); setResults([]); }}
          className="w-full sm:w-auto"
        >
          YouTube
        </Button>
        <Button 
          variant={platform === "spotify" ? "primary" : "secondary"} 
          onClick={() => { setPlatform("spotify"); setResults([]); }}
          className="w-full sm:w-auto"
        >
          Spotify
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <Input
          name="query"
          label="Search or Paste URL"
          hint="Search for a song on YouTube, or paste a Spotify/YouTube link."
          placeholder="e.g. Blinding Lights"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          error={error ?? undefined}
          disabled={isSubmitting}
          autoComplete="off"
        />

        {isSearching && (
          <div className="absolute right-3 top-[38px] text-xs text-muted">
            Searching...
          </div>
        )}
      </form>

      {results.length > 0 && !query.startsWith("http") && (
        <div className="mt-2 flex max-h-80 flex-col gap-2 overflow-y-auto rounded-lg border border-border bg-surface-elevated p-2 shadow-lg">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result.url)}
              disabled={isSubmitting}
              className="flex w-full items-center gap-3 rounded-md p-2 text-left transition hover:bg-surface focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand"
            >
              {result.thumbnail ? (
                <img src={result.thumbnail} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
              ) : (
                <div className="h-10 w-10 shrink-0 rounded bg-border"></div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{result.title}</p>
                <p className="truncate text-xs text-muted">{result.channelTitle}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {query.startsWith("http") && (
        <Button onClick={() => handleSelect(query)} isLoading={isSubmitting} className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      )}
    </div>
  );
}
