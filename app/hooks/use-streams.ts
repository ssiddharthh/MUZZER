"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createStream,
  downvoteStream,
  fetchStreams,
  upvoteStream,
} from "@/app/lib/api-client";
import type { StreamItem } from "@/app/types/stream";

export function useStreams() {
  const [streams, setStreams] = useState<StreamItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoting, setIsVoting] = useState<string | null>(null);

  const loadStreams = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextStreams = await fetchStreams();
      setStreams(nextStreams);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load queue",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStreams();
  }, [loadStreams]);

  const addStream = useCallback(
    async (url: string) => {
      setIsSubmitting(true);
      setError(null);

      try {
        await createStream(url);
        await loadStreams();
      } catch (submitError) {
        const message =
          submitError instanceof Error
            ? submitError.message
            : "Failed to add track";
        setError(message);
        throw submitError;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadStreams],
  );

  const toggleVote = useCallback(
    async (stream: StreamItem) => {
      setIsVoting(stream.id);
      setError(null);

      try {
        if (stream.haveUpvoted) {
          await downvoteStream(stream.id);
        } else {
          await upvoteStream(stream.id);
        }

        await loadStreams();
      } catch (voteError) {
        setError(
          voteError instanceof Error ? voteError.message : "Failed to update vote",
        );
      } finally {
        setIsVoting(null);
      }
    },
    [loadStreams],
  );

  return {
    streams,
    isLoading,
    error,
    isSubmitting,
    isVoting,
    loadStreams,
    addStream,
    toggleVote,
    setError,
  };
}
