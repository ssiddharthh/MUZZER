import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  return Response.json({
    id: user.id,
    email: user.email,
    role: user.role,
    provider: user.provider,
  });
}
