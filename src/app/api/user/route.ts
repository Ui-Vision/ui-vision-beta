import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ message: "Not authenticated", user: null });
  }

  const session = await decrypt(sessionToken);

  if (!session || typeof session.userId !== "string") {
    return NextResponse.json({ message: "Not authenticated", user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Not authenticated", user: null });
  }

  return NextResponse.json({ message: "Authenticated", user });
}
