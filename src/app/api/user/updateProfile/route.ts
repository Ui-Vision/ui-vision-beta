import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// تایپ‌دهی به درخواست و اطلاعات دریافت شده
interface UpdateProfileRequestBody {
  imageUrl: string;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ message: "Not authenticated", user: null });
  }

  const session = await decrypt(sessionToken);

  if (!session || typeof session.userId !== "string") {
    return NextResponse.json({ message: "Not authenticated", user: null });
  }

  const userId = session.userId;

  try {
    // دریافت داده‌ها از درخواست
    const { imageUrl }: UpdateProfileRequestBody = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ message: "No image URL provided" });
    }

    // به‌روزرسانی تصویر پروفایل کاربر در پایگاه داده
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ message: "Error updating profile", error: error.message });
  }
}