import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/sendEmail";
import jalaali from "jalaali-js";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionResponse = await createSession(user.id);

    const currentDate = new Date();
    const persianDate = jalaali.toJalaali(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    );
    const formattedPersianDate = `${persianDate.jy}/${persianDate.jm}/${persianDate.jd}`;

    const emailBody = `
      <p>سلام ${user.name},</p>
      <p>ورود شما به سیستم با موفقیت انجام شد. تاریخ ورود شما: ${formattedPersianDate}</p>
      <p>با تشکر،</p>
      <p>تیم پشتیبانی</p>
    `;

    await sendEmail(
      email,
      "ورود موفقیت آمیز به حساب کاربری",
      "ورود شما به سیستم با موفقیت انجام شد",
      emailBody
    );

    return sessionResponse;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
      return NextResponse.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "Internal server error", details: "Unknown error" },
        { status: 500 }
      );
    }
  }
}
