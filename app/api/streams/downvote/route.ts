import { getCurrentUser } from "@/app/lib/auth";
import { readJsonBody } from "@/app/lib/http";
import { prisma } from "@/app/lib/prisma";

type DownvoteBody = {
  streamId?: unknown;
};

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await readJsonBody<DownvoteBody>(request);

  if (!body || typeof body.streamId !== "string") {
    return Response.json({ message: "streamId is required" }, { status: 400 });
  }

  await prisma.upvote.deleteMany({
    where: {
      userId: user.id,
      streamId: body.streamId,
    },
  });

  return Response.json({ upvoted: false });
}
