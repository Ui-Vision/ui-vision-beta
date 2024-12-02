import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session"; 
import { prisma } from "@/lib/prisma"; 


export async function GET() {
  const cookieStore = await cookies(); 
  const sessionToken = cookieStore.get("session")?.value; 

  if (!sessionToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const session = await decrypt(sessionToken);

  if (!session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  // بررسی نوع session.userId
  if (typeof session.userId !== 'string') {
    return NextResponse.json({ error: "Invalid userId in session" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId }, // استفاده از session.userId به عنوان رشته
    select: { id: true, name: true, email: true }, // حذف image
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}