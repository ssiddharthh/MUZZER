import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      provider: "Google",
    },
  });
}
