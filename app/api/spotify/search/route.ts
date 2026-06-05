import { NextResponse } from "next/server";

// Simple in-memory caches (process-lifetime)
let clientTokenCache: { token: string; expiresAt: number } | null = null;
const resultsCache = new Map<string, { data: any; expiresAt: number }>();

function getRequiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required`);
  return v;
}

async function getClientToken() {
  const now = Date.now();
  if (clientTokenCache && clientTokenCache.expiresAt > now + 5000) {
    return { token: clientTokenCache.token };
  }

  const clientId = getRequiredEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = getRequiredEnv("SPOTIFY_CLIENT_SECRET");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text };
  }

  const data = await res.json();
  const expiresAt = Date.now() + (data.expires_in || 3600) * 1000;
  clientTokenCache = { token: data.access_token, expiresAt };

  return { token: data.access_token };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q) return NextResponse.json({ error: "q is required" }, { status: 400 });

  const cacheKey = `q:${q}`;
  const cached = resultsCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
  }

  // Check if env variables exist. If not, return mock data.
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    const mockData = [
      {
        id: `mock1-${Date.now()}`,
        title: `${q} - Mock Version 1`,
        thumbnail: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
        channelTitle: "Mock Artist",
        url: `https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT`
      },
      {
        id: `mock2-${Date.now()}`,
        title: `${q} - Mock Version 2`,
        thumbnail: "https://i.scdn.co/image/ab67616d00001e021021bc0841961eecbebc91ed",
        channelTitle: "Mock Artist 2",
        url: `https://open.spotify.com/track/7ouMYWcGJIjtNzaZ8L9bU7`
      }
    ];
    return NextResponse.json(mockData);
  }

  try {
    const ct = await getClientToken();
    if ((ct as any).error) return NextResponse.json({ error: "Failed to get token" }, { status: 500 });

    const token = (ct as any).token;

    const res = await fetch(`https://api.spotify.com/v1/search?${new URLSearchParams({ q, type: "track", limit: "10" })}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    
    // Format response to match YouTube Search structure
    const formatted = data.tracks.items.map((item: any) => ({
      id: item.id,
      title: item.name,
      thumbnail: item.album.images?.[0]?.url || "",
      channelTitle: item.artists.map((a: any) => a.name).join(", "),
      url: item.external_urls.spotify
    }));

    // cache for 30s
    resultsCache.set(cacheKey, { data: formatted, expiresAt: Date.now() + 30 * 1000 });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Spotify search error:", err);
    return NextResponse.json({ error: "Spotify search failed" }, { status: 500 });
  }
}
