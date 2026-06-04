"use client";

import { Alert } from "@/app/components/ui/alert";
import { EmptyState } from "@/app/components/ui/empty-state";
import { Spinner } from "@/app/components/ui/spinner";
import { StreamCard } from "@/app/components/streams/stream-card";
import type { StreamItem } from "@/app/types/stream";

type StreamQueueProps = {
  streams: StreamItem[];
  isLoading?: boolean;
  error?: string | null;
  canVote?: boolean;
  isVotingId?: string | null;
  onToggleVote?: (stream: StreamItem) => void;
  showOwner?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
};

export function StreamQueue({
  streams,
  isLoading = false,
  error = null,
  canVote = false,
  isVotingId = null,
  onToggleVote,
  showOwner = true,
  emptyTitle = "The queue is empty",
  emptyDescription = "Be the first to add a YouTube or Spotify link and start the session.",
  emptyActionLabel,
  emptyActionHref,
}: StreamQueueProps) {
  if (isLoading) {
    return <Spinner label="Loading queue..." />;
  }

  if (error) {
    return <Alert variant="error" title="Something went wrong">{error}</Alert>;
  }

  if (streams.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        actionHref={emptyActionHref}
      />
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="Music queue">
      {streams.map((stream, index) => (
        <div key={stream.id} role="listitem">
          <StreamCard
            stream={stream}
            rank={index + 1}
            canVote={canVote}
            isVoting={isVotingId === stream.id}
            onToggleVote={onToggleVote}
            showOwner={showOwner}
          />
        </div>
      ))}
    </div>
  );
}
