import { NextResponse } from "next/server";

export async function GET() {
  const enabled = Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);

  return NextResponse.json({
    enabled,
    message: enabled
      ? "Spotify is configured."
      : "Spotify integration is not configured. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.",
  });
}
