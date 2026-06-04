import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const uri = body?.uri;
  if (!uri) return NextResponse.json({ error: "uri is required" }, { status: 400 });

  const accessToken = (session as any).accessToken;
  if (!accessToken) return NextResponse.json({ error: "No access token" }, { status: 403 });

  const res = await fetch(`https://api.spotify.com/v1/me/player/queue?${new URLSearchParams({ uri })}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 204) {
    return NextResponse.json({ ok: true });
  }

  const text = await res.text();
  return NextResponse.json({ error: text }, { status: res.status });
}
