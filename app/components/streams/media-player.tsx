import type { StreamItem } from "@/app/types/stream";

type MediaPlayerProps = {
  stream: StreamItem | null;
};

function getSpotifyEmbedSrc(extractedId: string) {
  const [type, id] = extractedId.split(":");
  if (!type || !id) {
    return null;
  }

  return `https://open.spotify.com/embed/${type}/${id}`;
}

export function MediaPlayer({ stream }: MediaPlayerProps) {
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
        <iframe
          title={stream.title ?? "YouTube preview"}
          src={`https://www.youtube.com/embed/${stream.extractedId}`}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const spotifySrc = getSpotifyEmbedSrc(stream.extractedId);

  if (!spotifySrc) {
    return (
      <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6 text-sm text-muted">
        Unable to embed this Spotify link.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-black">
      <iframe
        title={stream.title ?? "Spotify preview"}
        src={spotifySrc}
        className="h-[22rem] w-full"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
