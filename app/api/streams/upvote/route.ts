import { getCurrentUser } from "@/app/lib/auth";
import { readJsonBody } from "@/app/lib/http";
import { prisma } from "@/app/lib/prisma";

type UpvoteBody = {
  streamId?: unknown;
};

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await readJsonBody<UpvoteBody>(request);

  if (!body || typeof body.streamId !== "string") {
    return Response.json({ message: "streamId is required" }, { status: 400 });
  }

  const stream = await prisma.stream.findUnique({
    where: { id: body.streamId },
  });

  if (!stream || !stream.active) {
    return Response.json({ message: "Stream not found" }, { status: 404 });
  }

  await prisma.upvote.upsert({
    where: {
      userId_streamId: {
        userId: user.id,
        streamId: stream.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      streamId: stream.id,
    },
  });

  return Response.json({ upvoted: true });
}
