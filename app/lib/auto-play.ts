/**
 * Auto-Play Configuration and Utilities
 * Manages video/track completion detection and queue progression
 */

export interface AutoPlayConfig {
  enabled: boolean;
  pollIntervalMs: number;
  autoMarkAsPlayed: boolean;
  skipOnError: boolean;
}

export const DEFAULT_AUTO_PLAY_CONFIG: AutoPlayConfig = {
  enabled: true,
  pollIntervalMs: 3000, // 3 seconds
  autoMarkAsPlayed: true,
  skipOnError: true,
};

/**
 * Detects if a stream is from YouTube
 */
export function isYouTubeStream(type: string): boolean {
  return type === "Youtube" || type === "YOUTUBE" || type === "youtube";
}

/**
 * Detects if a stream is from Spotify
 */
export function isSpotifyStream(type: string): boolean {
  return type === "Spotify" || type === "SPOTIFY" || type === "spotify";
}

/**
 * Extracts video ID from various YouTube URL formats
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /^([^&\n?#]+)$/, // Direct ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extracts Spotify URI from URL or direct URI
 */
export function extractSpotifyUri(url: string): string | null {
  // Format: spotify:track:id or spotify:album:id or spotify:playlist:id
  if (url.startsWith("spotify:")) {
    return url;
  }

  // Extract from Spotify URL: https://open.spotify.com/track/id
  const match = url.match(/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (match) {
    return `spotify:${match[1]}:${match[2]}`;
  }

  return null;
}

/**
 * Gets a human-readable display name for a stream source
 */
export function getSourceDisplayName(type: string): string {
  if (isYouTubeStream(type)) {
    return "YouTube";
  }
  if (isSpotifyStream(type)) {
    return "Spotify";
  }
  return "Unknown";
}

/**
 * Validates stream completion based on type
 * Returns true if stream should be marked as completed
 */
export function shouldMarkAsCompleted(
  streamType: string,
  durationSeconds: number,
  elapsedSeconds: number,
  completionThreshold: number = 0.95
): boolean {
  // Mark as completed if 95% of the way through
  return elapsedSeconds >= durationSeconds * completionThreshold;
}

/**
 * Calculates time until next auto-play check
 */
export function getNextCheckDelay(pollIntervalMs: number): number {
  const jitter = Math.random() * 1000; // 0-1 second jitter
  return pollIntervalMs + jitter;
}

/**
 * Formats queue position info for display
 */
export function formatQueuePosition(
  position: number,
  total: number
): string {
  return `${position + 1} of ${total}`;
}

/**
 * Determines if auto-play should trigger based on conditions
 */
export function shouldAutoPlayNext(
  enabled: boolean,
  isCurrentVideoEnded: boolean,
  queueLength: number,
  hasError: boolean
): boolean {
  if (!enabled) return false;
  if (!isCurrentVideoEnded) return false;
  if (queueLength <= 1) return false;
  if (hasError) return false;

  return true;
}
