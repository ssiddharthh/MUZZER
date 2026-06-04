import { getCurrentUser } from "@/app/lib/auth";
import { readJsonBody } from "@/app/lib/http";
import { prisma } from "@/app/lib/prisma";

type CreateStreamBody = {
  url?: unknown;
};

function getYoutubeId(url: URL) {
  if (url.hostname === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0] ?? null;
  }

  if (url.hostname.endsWith("youtube.com")) {
    if (url.pathname === "/watch") {
      return url.searchParams.get("v");
    }

    const [, route, id] = url.pathname.split("/");
    if (route === "shorts" || route === "embed") {
      return id ?? null;
    }
  }

  return null;
}

function getSpotifyId(url: URL) {
  if (!url.hostname.endsWith("spotify.com")) {
    return null;
  }

  const [, type, id] = url.pathname.split("/");
  if (!type || !id) {
    return null;
  }

  return `${type}:${id}`;
}

function parseStreamUrl(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    const url = new URL(value);
    const youtubeId = getYoutubeId(url);

    if (youtubeId) {
      return {
        type: "Youtube" as const,
        extractedId: youtubeId,
        url: url.toString(),
        title: value,
      };
    }

    const spotifyId = getSpotifyId(url);

    if (spotifyId) {
      return {
        type: "Spotify" as const,
        extractedId: spotifyId,
        url: url.toString(),
        title: value,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await readJsonBody<CreateStreamBody>(request);

  if (!body) {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const streamInput = parseStreamUrl(body.url);

  if (!streamInput) {
    return Response.json(
      { message: "Please send a valid YouTube or Spotify URL" },
      { status: 400 },
    );
  }

  const stream = await prisma.stream.upsert({
    where: {
      userId_extractedId: {
        userId: user.id,
        extractedId: streamInput.extractedId,
      },
    },
    update: {
      active: true,
      title: streamInput.title,
      url: streamInput.url,
    },
    create: {
      ...streamInput,
      userId: user.id,
    },
  });

  return Response.json({ stream }, { status: 201 });
}

export async function GET() {
  const user = await getCurrentUser();

  const streams = await prisma.stream.findMany({
    where: { active: true },
    include: {
      upvotes: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  const formattedStreams = streams
    .map((stream) => ({
      id: stream.id,
      type: stream.type,
      url: stream.url,
      extractedId: stream.extractedId,
      title: stream.title,
      smallImg: stream.smallImg,
      bigImg: stream.bigImg,
      active: stream.active,
      user: stream.user,
      upvotes: stream.upvotes.length,
      haveUpvoted: user
        ? stream.upvotes.some((upvote) => upvote.userId === user.id)
        : false,
      createdAt: stream.createdAt,
    }))
    .sort((a, b) => b.upvotes - a.upvotes);

  return Response.json({ streams: formattedStreams });
}
