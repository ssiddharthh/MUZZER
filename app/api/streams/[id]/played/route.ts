import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return Response.json({ message: "Stream ID required" }, { status: 400 });
  }

  const stream = await prisma.stream.findUnique({
    where: { id },
  });

  if (!stream) {
    return Response.json({ message: "Stream not found" }, { status: 404 });
  }

  await prisma.stream.update({
    where: { id },
    data: { active: false },
  });

  return Response.json({ success: true });
}
