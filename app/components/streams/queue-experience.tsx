"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

import { MediaPlayer } from "@/app/components/streams/media-player";
import { StreamForm } from "@/app/components/streams/stream-form";
import { StreamQueue } from "@/app/components/streams/stream-queue";
import { Alert } from "@/app/components/ui/alert";
import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useStreams } from "@/app/hooks/use-streams";

type QueueExperienceProps = {
  title: string;
  description: string;
  showSubmitForm?: boolean;
  filterByEmail?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
};

export function QueueExperience({
  title,
  description,
  showSubmitForm = false,
  filterByEmail,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionHref,
}: QueueExperienceProps) {
  const { status } = useSession();
  const {
    streams,
    isLoading,
    error,
    isSubmitting,
    isVoting,
    autoPlayEnabled,
    setAutoPlayEnabled,
    addStream,
    toggleVote,
    playNext,
    markAsPlayed,
  } = useStreams();

  const filteredStreams = useMemo(() => {
    if (!filterByEmail) {
      return streams;
    }

    return streams.filter((stream) => stream.user.email === filterByEmail);
  }, [filterByEmail, streams]);

  const nowPlaying = filteredStreams[0] ?? null;
  const canVote = status === "authenticated";

  const handleVideoEnd = () => {
    if (autoPlayEnabled && nowPlaying) {
      void markAsPlayed(nowPlaying.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">{description}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Now playing</CardTitle>
                <CardDescription>
                  The highest-voted active track in the queue.
                </CardDescription>
              </div>
              <button
                onClick={() => setAutoPlayEnabled(!autoPlayEnabled)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  autoPlayEnabled
                    ? "bg-brand text-white"
                    : "border border-border bg-surface text-muted hover:bg-surface-elevated"
                }`}
                title={autoPlayEnabled ? "Auto-play enabled" : "Auto-play disabled"}
              >
                {autoPlayEnabled ? "Auto-play ON" : "Auto-play OFF"}
              </button>
            </div>
          </CardHeader>
          <MediaPlayer stream={nowPlaying} onVideoEnd={handleVideoEnd} />
        </Card>

        {showSubmitForm ? (
          <Card>
            <CardHeader>
              <CardTitle>Add a track</CardTitle>
              <CardDescription>
                Paste a public YouTube or Spotify URL to request playback.
              </CardDescription>
            </CardHeader>
            <StreamForm onSubmit={addStream} isSubmitting={isSubmitting} />
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>How voting works</CardTitle>
              <CardDescription>
                Sign in to upvote tracks and move your favorites to the top of the
                queue.
              </CardDescription>
            </CardHeader>
            {!canVote ? (
              <Alert variant="info">
                You can browse the live queue without signing in. Sign in to vote on
                tracks.
              </Alert>
            ) : (
              <Alert variant="success">
                You are signed in. Use the vote controls in the queue list below.
              </Alert>
            )}
          </Card>
        )}
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Music queue</CardTitle>
          <CardDescription>
            Sorted by upvotes. {filteredStreams.length} active track
            {filteredStreams.length === 1 ? "" : "s"}.
          </CardDescription>
        </CardHeader>
        <StreamQueue
          streams={filteredStreams}
          isLoading={isLoading}
          error={error}
          canVote={canVote}
          isVotingId={isVoting}
          onToggleVote={toggleVote}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          emptyActionLabel={emptyActionLabel}
          emptyActionHref={emptyActionHref}
        />
      </Card>
    </div>
  );
}
