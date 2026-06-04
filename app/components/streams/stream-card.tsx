"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/app/components/ui/badge";
import { VoteButton } from "@/app/components/streams/vote-button";
import {
  getStreamLabel,
  getStreamThumbnail,
  getStreamerLabel,
} from "@/app/lib/stream-display";
import type { StreamItem } from "@/app/types/stream";

type StreamCardProps = {
  stream: StreamItem;
  rank?: number;
  canVote?: boolean;
  isVoting?: boolean;
  onToggleVote?: (stream: StreamItem) => void;
  showOwner?: boolean;
};

export function StreamCard({
  stream,
  rank,
  canVote = false,
  isVoting = false,
  onToggleVote,
  showOwner = true,
}: StreamCardProps) {
  const thumbnail = getStreamThumbnail(stream);
  const label = getStreamLabel(stream);

  return (
    <article className="glass-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {typeof rank === "number" ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-sm font-semibold text-brand">
            #{rank}
          </div>
        ) : null}

        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-elevated">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt=""
              fill
              className="object-cover"
              sizes="64px"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl text-muted">
              ♪
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={stream.type === "Youtube" ? "youtube" : "spotify"}>
              {stream.type}
            </Badge>
            {showOwner ? (
              <span className="text-xs text-muted">
                by {getStreamerLabel(stream.user.email)}
              </span>
            ) : null}
          </div>
          <h3 className="truncate text-base font-semibold">{label}</h3>
          <Link
            href={stream.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block truncate text-xs text-brand hover:underline"
          >
            Open source link
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        {canVote && onToggleVote ? (
          <VoteButton
            upvotes={stream.upvotes}
            haveUpvoted={stream.haveUpvoted}
            isLoading={isVoting}
            onToggle={() => onToggleVote(stream)}
          />
        ) : (
          <div className="rounded-xl border border-border px-3 py-2 text-sm text-muted">
            {stream.upvotes} votes
          </div>
        )}
      </div>
    </article>
  );
}
