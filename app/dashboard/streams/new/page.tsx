"use client";

import Link from "next/link";

import { StreamForm } from "@/app/components/streams/stream-form";
import { Alert } from "@/app/components/ui/alert";
import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useStreams } from "@/app/hooks/use-streams";

export default function NewStreamPage() {
  const { addStream, isSubmitting, error } = useStreams();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">Streams</p>
        <h1 className="text-3xl font-semibold tracking-tight">Add a track</h1>
        <p className="mt-2 text-sm text-muted">
          Create a new queue item by pasting a supported media URL.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stream creation</CardTitle>
          <CardDescription>
            Reuses the existing <code className="text-brand">POST /api/streams</code>{" "}
            endpoint to validate and store YouTube or Spotify links.
          </CardDescription>
        </CardHeader>
        <StreamForm onSubmit={addStream} isSubmitting={isSubmitting} />
      </Card>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <p className="text-sm text-muted">
        After submitting, view your track in the{" "}
        <Link href="/dashboard/queue" className="text-brand hover:underline">
          queue management page
        </Link>{" "}
        or the{" "}
        <Link href="/queue" className="text-brand hover:underline">
          live queue
        </Link>
        .
      </p>
    </div>
  );
}
