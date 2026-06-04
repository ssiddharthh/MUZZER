import type { StreamItem } from "@/app/types/stream";

export function getStreamThumbnail(stream: StreamItem) {
  if (stream.smallImg) {
    return stream.smallImg;
  }

  if (stream.bigImg) {
    return stream.bigImg;
  }

  if (stream.type === "Youtube") {
    return `https://img.youtube.com/vi/${stream.extractedId}/mqdefault.jpg`;
  }

  return null;
}

export function getStreamLabel(stream: StreamItem) {
  if (stream.title && !stream.title.startsWith("http")) {
    return stream.title;
  }

  if (stream.type === "Youtube") {
    return `YouTube · ${stream.extractedId}`;
  }

  const [spotifyType, spotifyId] = stream.extractedId.split(":");
  return `Spotify ${spotifyType} · ${spotifyId ?? stream.extractedId}`;
}

export function getStreamerLabel(email: string) {
  return email.split("@")[0] ?? email;
}

export function formatVoteCount(count: number) {
  return new Intl.NumberFormat().format(count);
}
