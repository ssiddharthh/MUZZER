"use client";

import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Spinner } from "@/app/components/ui/spinner";
import { useStreams } from "@/app/hooks/use-streams";
import { useUser } from "@/app/hooks/use-user";

export default function DashboardPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const { streams, isLoading: isStreamsLoading } = useStreams();

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
      </div>
    </div>
  );
}
