// /app/api/user/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session"; // متد decrypt از session.ts
import { prisma } from "@/lib/prisma"; // اتصال Prisma

interface Session {
  userId: string; // تعریف تایپ برای userId
}

export async function GET() {
  // از await برای دریافت کوکی استفاده کنید
  const cookieStore = await cookies(); // دریافت کوکی‌ها
  const sessionToken = cookieStore.get("session")?.value; // حالا می‌توانید get را روی cookieStore فراخوانی کنید

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