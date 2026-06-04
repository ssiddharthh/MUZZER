import type { ApiError, CurrentUser, StreamItem, StreamsResponse } from "@/app/types/stream";

async function parseJson<T>(response: Response): Promise<T | ApiError> {
  return (await response.json()) as T | ApiError;
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return fallback;
}

export async function fetchStreams() {
  const response = await fetch("/api/streams", { cache: "no-store" });
  const payload = await parseJson<StreamsResponse>(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Failed to load queue"));
  }

  return (payload as StreamsResponse).streams;
}

export async function fetchCurrentUser() {
  const response = await fetch("/api/me", { cache: "no-store" });

  if (response.status === 401) {
    return null;
  }

  const payload = await parseJson<CurrentUser>(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Failed to load profile"));
  }

  return payload as CurrentUser;
}

export async function createStream(url: string) {
  const response = await fetch("/api/streams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const payload = await parseJson<{ stream: StreamItem }>(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Failed to add track"));
  }

  return (payload as { stream: StreamItem }).stream;
}

export async function upvoteStream(streamId: string) {
  const response = await fetch("/api/streams/upvote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ streamId }),
  });

  const payload = await parseJson<{ upvoted: boolean }>(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Failed to upvote"));
  }

  return (payload as { upvoted: boolean }).upvoted;
}

export async function downvoteStream(streamId: string) {
  const response = await fetch("/api/streams/downvote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ streamId }),
  });

  const payload = await parseJson<{ upvoted: boolean }>(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Failed to remove vote"));
  }

  return (payload as { upvoted: boolean }).upvoted;
}
