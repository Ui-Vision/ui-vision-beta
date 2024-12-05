import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { email, verificationCode } = await req.json();

    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: { verificationCodes: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    const verificationEntry = user.verificationCodes.find(
      (code) => code.code === verificationCode
    );

    if (!verificationEntry) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }
    if (new Date() > new Date(verificationEntry.expiresAt)) {
      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    await prisma.verificationCode.deleteMany({
      where: { userId: user.id },
    });

    const sessionResponse = await createSession(user.id);

    const SuccessEmail = `
    <p>سلام ${user.name},</p>
    <p>تبریک می‌گوییم! ثبت‌نام شما با موفقیت تکمیل شد.</p>
    <p>از اینکه به جمع ما پیوستید خوشحالیم.</p>
    <p>با تشکر، تیم پشتیبانی.</p>
  `;
    await sendEmail(
      email,
      "ثبت نام تکمیل شد !⭐️",
      `ثبت نام شما با موفقیت تکمیل گردید !`,
      SuccessEmail
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Verification error:", error.message);
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
