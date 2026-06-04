"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Spinner } from "@/app/components/ui/spinner";
import { useStreams } from "@/app/hooks/use-streams";
import { useUser } from "@/app/hooks/use-user";
import { useSpotifyAvailability } from "@/app/hooks/use-spotify-availability";

export default function DashboardPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const { streams, isLoading: isStreamsLoading } = useStreams();
  const { availability: spotifyAvailability, loading: spotifyLoading } = useSpotifyAvailability();

  const myStreams = streams.filter((stream) => stream.user.email === user?.email);
  const totalVotes = streams.reduce((sum, stream) => sum + stream.upvotes, 0);

  if (isUserLoading || isStreamsLoading) {
    return <Spinner label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">Welcome back</p>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          Manage your submissions, monitor queue activity, and jump into the live
          session view.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Active queue tracks</CardDescription>
            <CardTitle className="text-3xl">{streams.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Your submissions</CardDescription>
            <CardTitle className="text-3xl">{myStreams.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total upvotes</CardDescription>
            <CardTitle className="text-3xl">{totalVotes}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Account role</CardDescription>
            <CardTitle className="text-3xl">{user?.role ?? "—"}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Link href="/dashboard/streams/new" className="glass-panel block p-5 transition hover:border-brand/40">
          <h2 className="font-semibold">Add a track</h2>
          <p className="mt-2 text-sm text-muted">
            Submit a YouTube or Spotify URL to the shared queue.
          </p>
        </Link>
        <Link href="/dashboard/queue" className="glass-panel block p-5 transition hover:border-brand/40">
          <h2 className="font-semibold">Manage your queue items</h2>
          <p className="mt-2 text-sm text-muted">
            Review the tracks you have submitted to the session.
          </p>
        </Link>
        <Link href="/queue" className="glass-panel block p-5 transition hover:border-brand/40">
          <h2 className="font-semibold">Open live queue</h2>
          <p className="mt-2 text-sm text-muted">
            See the audience-facing queue and voting interface.
          </p>
        </Link>
        <div className="glass-panel p-5">
          <h2 className="font-semibold">Spotify</h2>
          <p className="mt-2 text-sm text-muted">Connect your Spotify account to control playback.</p>
          {spotifyLoading ? (
            <div className="mt-4 text-sm text-muted">Checking Spotify configuration...</div>
          ) : spotifyAvailability?.enabled ? (
            <div className="mt-4 flex gap-2">
              <Button onClick={() => signIn("spotify")}>Connect Spotify</Button>
              <Link href="/dashboard/spotify" className="ml-auto">
                <Button variant="secondary">Manage</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
              Spotify integration is not configured. Add <code>SPOTIFY_CLIENT_ID</code> and <code>SPOTIFY_CLIENT_SECRET</code> to <code>.env</code>, then restart the app. Use <code>.env.example</code> as a template.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
