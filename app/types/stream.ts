import type { Role, StreamType } from "@/app/generated/prisma/enums";

export type StreamUser = {
  id: string;
  email: string;
};

export type StreamItem = {
  id: string;
  type: StreamType;
  url: string;
  extractedId: string;
  title: string | null;
  smallImg: string | null;
  bigImg: string | null;
  active: boolean;
  user: StreamUser;
  upvotes: number;
  haveUpvoted: boolean;
  createdAt: string;
};

export type StreamsResponse = {
  streams: StreamItem[];
};

export type CurrentUser = {
  id: string;
  email: string;
  role: Role;
  provider: string;
};

export type ApiError = {
  message: string;
};
