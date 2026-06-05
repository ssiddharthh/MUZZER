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
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  const loadStreams = useCallback(async () => {
    setIsLoading((prev) => {
      // If we already have streams, don't show the loading spinner again
      // to prevent UI flickering during polling
      return prev; 
    });
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

  // Set up polling to keep queue updated (every 3 seconds)
  useEffect(() => {
    void loadStreams();

    const interval = setInterval(() => {
      void loadStreams();
    }, 3000);

    setPollInterval(interval);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loadStreams]);

  const playNext = useCallback(async () => {
    if (!autoPlayEnabled || streams.length <= 1) {
      return;
    }

    try {
      setError(null);
      await loadStreams();
    } catch (playNextError) {
      setError(
        playNextError instanceof Error
          ? playNextError.message
          : "Failed to load next track",
      );
    }
  }, [autoPlayEnabled, streams.length, loadStreams]);

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

  const markAsPlayed = useCallback(async (streamId: string) => {
    try {
      setError(null);
      // Call API to mark stream as played (requires new endpoint)
      const response = await fetch(`/api/streams/${streamId}/played`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to mark stream as played");
      }

      await loadStreams();
    } catch (playedError) {
      setError(
        playedError instanceof Error
          ? playedError.message
          : "Failed to mark track as played",
      );
    }
  }, [loadStreams]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  return {
    streams,
    isLoading,
    error,
    isSubmitting,
    isVoting,
    autoPlayEnabled,
    setAutoPlayEnabled,
    loadStreams,
    addStream,
    toggleVote,
    playNext,
    markAsPlayed,
    setError,
  };
}
