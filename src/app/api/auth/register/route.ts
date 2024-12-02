import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name || "Anonymous",
        email,
        password: hashedPassword,
      },
    });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10); // تاریخ انقضای کد تایید

    await prisma.verificationCode.create({
      data: {
        userId: newUser.id,
        code: verificationCode,
        expiresAt: expirationTime,
      },
    });

    const emailContent = `
      <p>کد تایید شما :‌ <strong>${verificationCode}</strong></p>
      <p>این کد بعد از گذشت ۱۰ دقیقه منقضی خواهد شد </p>
    `;
    await sendEmail(
      email,
      "کد تایید ",
      `کد تایید شما برای ورود به سایت : ${verificationCode}`,
      emailContent
    );

    return NextResponse.json({
      message: "User registered successfully. Verification email sent.",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Register error:", error.message);
      return NextResponse.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    } else if (typeof error === "string") {
      console.error("Register error:", error);
      return NextResponse.json(
        { error: "Internal server error", details: error },
        { status: 500 }
      );
    }

    console.error("Register error: Unknown error", error);
    return NextResponse.json(
      { error: "Internal server error", details: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
