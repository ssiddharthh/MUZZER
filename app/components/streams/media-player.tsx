"use client";

import { useEffect, useRef } from "react";
import YouTubePlayer from "youtube-player";

import { SpotifyPlayback } from "@/app/components/streams/spotify-playback";
import type { StreamItem } from "@/app/types/stream";

type MediaPlayerProps = {
  stream: StreamItem | null;
  onVideoEnd?: () => void;
};

function getSpotifyEmbedSrc(extractedId: string) {
  const [type, id] = extractedId.split(":");
  if (!type || !id) {
    return null;
  }

  return `https://open.spotify.com/embed/${type}/${id}`;
}

export function MediaPlayer({ stream, onVideoEnd }: MediaPlayerProps) {
  const playerRef = useRef<ReturnType<typeof YouTubePlayer> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize YouTube player and handle video completion
  useEffect(() => {
    if (!stream || stream.type !== "Youtube" || !containerRef.current) {
      return;
    }

    // Initialize player
    const player = YouTubePlayer(containerRef.current);
    playerRef.current = player;

    // Set video and listen for events
    player.loadVideoById(stream.extractedId);
    player.playVideo();

    const handleStateChange = (event: any) => {
      const state = event?.data;
      // state === 0 means video ended
      if (state === 0 && onVideoEnd) {
        onVideoEnd();
      }
    };

    player.on("stateChange", handleStateChange);

    return () => {
      player.destroy();
      playerRef.current = null;
    };
  }, [stream, onVideoEnd]);

  if (!stream) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border bg-surface/60 text-sm text-muted">
        Queue a track to preview playback here.
      </div>
    );
  }

  if (stream.type === "Youtube") {
    return (
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-black shadow-glow">
        <div
          ref={containerRef}
          className="aspect-video w-full"
          data-testid="youtube-player"
        />
      </div>
    );
  }

  return (
    <div>
      <SpotifyPlayback />
      <div className="mt-4">
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-black">
          <iframe
            title={stream.title ?? "Spotify preview"}
            src={getSpotifyEmbedSrc(stream.extractedId) ?? ""}
            className="h-[22rem] w-full"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
