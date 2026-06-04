"use client";

import { Button } from "@/app/components/ui/button";
import { formatVoteCount } from "@/app/lib/stream-display";

type VoteButtonProps = {
  upvotes: number;
  haveUpvoted: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onToggle: () => void;
};

export function VoteButton({
  upvotes,
  haveUpvoted,
  disabled = false,
  isLoading = false,
  onToggle,
}: VoteButtonProps) {
  return (
    <Button
      type="button"
      variant={haveUpvoted ? "primary" : "secondary"}
      size="sm"
      className="min-w-[5.5rem]"
      disabled={disabled}
      isLoading={isLoading}
      onClick={onToggle}
      aria-pressed={haveUpvoted}
      aria-label={haveUpvoted ? "Remove upvote" : "Upvote track"}
    >
      <span aria-hidden>{haveUpvoted ? "▲" : "△"}</span>
      <span>{formatVoteCount(upvotes)}</span>
    </Button>
  );
}
