"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

type StreamFormProps = {
  onSubmit: (url: string) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function StreamForm({
  onSubmit,
  isSubmitting = false,
  submitLabel = "Add to queue",
}: StreamFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("Paste a YouTube or Spotify URL to continue.");
      return;
    }

    try {
      await onSubmit(url.trim());
      setUrl("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not add this track.",
      );
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        name="url"
        label="Track URL"
        hint="Supports YouTube videos and Spotify tracks, albums, or playlists."
        placeholder="https://open.spotify.com/track/... or https://youtube.com/watch?v=..."
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        error={error ?? undefined}
        disabled={isSubmitting}
        autoComplete="off"
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}
